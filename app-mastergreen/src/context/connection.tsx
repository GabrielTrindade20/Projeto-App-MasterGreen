import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as Network from 'expo-network';
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { addToQueue, initialState, localDate, parseStoredState, sessionValid, type LocalState, type MobileData, type QuickProposal, type Session } from '@/lib/mobile-state';
import { clearSession, readSession, writeSession } from '@/lib/session-store';
import { enableBackgroundSync } from '@/lib/background-sync';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
type Connection = {
  local: LocalState; session: Session | null; ready: boolean; loading: boolean; syncing: boolean; error: string; fatal: string; needsLogin: boolean; backgroundStatus:string;
  change: (update: (state: LocalState) => LocalState) => Promise<void>;
  finalize: (payload: Omit<QuickProposal,'clientId'>) => Promise<void>;
  sync: () => Promise<void>; login: (email:string,password:string) => Promise<void>; logout: () => Promise<void>;
};
const Context = createContext<Connection | null>(null);
const storageKey = (userId:string) => '@mastergreen/v1/' + API_URL + '/' + userId;
class ApiError extends Error { constructor(message:string, public status:number) { super(message); } }
async function request(path:string, token?:string, body?:unknown) {
  if (!API_URL) throw new Error('Endereço do sistema não configurado.');
  if (!__DEV__ && !API_URL.startsWith('https://')) throw new Error('A versão instalada precisa de uma conexão HTTPS segura.');
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(),15000);
  try {
    const response = await fetch(API_URL + '/api/mobile' + path, { method:body===undefined?'GET':'POST',
      headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},
      body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal });
    const data = await response.json();
    if (!response.ok) throw new ApiError(data.message || 'Não foi possível sincronizar.',response.status);
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error('Sistema indisponível. Seus dados continuam salvos no celular.');
  } finally { clearTimeout(timer); }
}

export function ConnectionProvider({children}:PropsWithChildren) {
  const [local,setLocal] = useState<LocalState>(initialState);
  const [session,setSession] = useState<Session|null>(null);
  const [ready,setReady] = useState(false);
  const [loading,setLoading] = useState(false);
  const [syncing,setSyncing] = useState(false);
  const [error,setError] = useState('');
  const [fatal,setFatal] = useState('');
  const [backgroundStatus,setBackgroundStatus]=useState('Verificando disponibilidade…');
  const stateRef = useRef(local);
  const sessionRef = useRef(session);
  const writeChain = useRef<Promise<void>>(Promise.resolve());
  const syncLock = useRef(false);
  const authLock = useRef(false);
  const [needsLogin,setNeedsLogin] = useState(false);

  const change = useCallback((update:(state:LocalState)=>LocalState):Promise<void> => {
    const owner = sessionRef.current?.user.id;
    if (!owner) return Promise.reject(new Error('Entre no aplicativo primeiro.'));
    const next = update(stateRef.current);
    stateRef.current = next; setLocal(next);
    const save = writeChain.current.catch(()=>{}).then(()=>AsyncStorage.setItem(storageKey(owner),JSON.stringify(next)));
    writeChain.current = save;
    void save.catch(()=>setError('Não foi possível salvar no celular. Não feche o app; libere espaço e tente novamente.'));
    return save;
  },[]);

  useEffect(()=>{ let active=true; void (async()=>{
    try {
      const raw = await readSession();
      if (raw) {
        const saved = JSON.parse(raw) as Session & { apiUrl?: string };
        if (!saved.user?.id || !saved.token || !saved.expiresAt) throw new Error('Sessão local inválida. Procure suporte sem reinstalar.');
        if (saved.apiUrl === API_URL) {
          const cached = parseStoredState(await AsyncStorage.getItem(storageKey(saved.user.id)));
          if (active) { sessionRef.current=saved;setSession(saved);stateRef.current=cached;setLocal(cached);setNeedsLogin(!sessionValid(saved)); }
        }
      }
    } catch(cause) { if(active)setFatal(cause instanceof Error?cause.message:'Falha ao ler armazenamento local.'); }
    finally { if(active)setReady(true); }
  })(); return ()=>{active=false;}; },[]);

  const sync = useCallback(async()=>{
    const current = sessionRef.current;
    if (!current || syncLock.current || authLock.current) return;
    if (!sessionValid(current)) { setNeedsLogin(true);setError('Renove o login para enviar. O orçamento e o PDF continuam disponíveis.');return; }
    syncLock.current=true;setSyncing(true);
    try {
      const network = await Network.getNetworkStateAsync();
      if (network.isConnected === false) { setError('Sem conexão. Propostas guardadas no celular.');return; }
      if (!stateRef.current.preferences.mobileData && Platform.OS!=='web' && network.type!==Network.NetworkStateType.WIFI && network.type!==Network.NetworkStateType.ETHERNET) {
        setError('Aguardando Wi-Fi. Você pode liberar dados móveis nas configurações.');return;
      }
      await writeChain.current;
      const pending = stateRef.current.queue.filter(row=>!row.sentAt);
      for (const row of pending) {
        if (sessionRef.current?.token!==current.token) return;
        try {
          const result = await request('/proposals',current.token,row.payload);
          await change(state=>({...state,queue:state.queue.map(item=>item.payload.clientId===row.payload.clientId?{...item,sentAt:new Date().toISOString(),serverId:result.id,error:undefined}:item)}));
        } catch(cause) {
          if (cause instanceof ApiError && (cause.status===400 || cause.status===409)) {
            await change(state=>({...state,queue:state.queue.map(item=>item.payload.clientId===row.payload.clientId?{...item,error:cause.message}:item)}));
            continue;
          }
          throw cause;
        }
      }
      const data = await request('/data?month='+localDate().slice(0,7),current.token) as MobileData;
      if (!Array.isArray(data.customers) || !Array.isArray(data.history) || !data.summary) throw new Error('Resposta incompleta do sistema.');
      if (sessionRef.current?.token!==current.token) return;
      await change(state=>({...state,data,lastSync:new Date().toISOString()}));
      setError(stateRef.current.queue.some(row=>!row.sentAt&&row.error)?'Algumas propostas precisam de atenção. Veja Configurações.':'');setNeedsLogin(false);
    } catch(cause) {
      if (cause instanceof ApiError && cause.status===401) setNeedsLogin(true);
      setError(cause instanceof Error?cause.message:'Falha ao sincronizar.');
    } finally { syncLock.current=false;setSyncing(false); }
  },[change]);

  useEffect(()=>{
    if (!ready || !session) return;
    void enableBackgroundSync().then(setBackgroundStatus).catch(()=>setBackgroundStatus('Indisponível. Abra o app para enviar as propostas.'));
    void sync();
    const connection = Network.addNetworkStateListener(()=>{ if(AppState.currentState==='active' || Platform.OS==='web')void sync(); });
    const app = AppState.addEventListener('change',value=>{if(value==='active')void sync();});
    const timer=setInterval(()=>{ if(AppState.currentState==='active' || Platform.OS==='web')void sync(); },30000);
    return ()=>{connection.remove();app.remove();clearInterval(timer);};
  },[ready,session,sync]);

  async function login(email:string,password:string) {
    if (syncLock.current || authLock.current) throw new Error('Aguarde a sincronização terminar.');
    authLock.current=true;setLoading(true);setError('');
    try {
      await writeChain.current;
      const result = await request('/auth/login',undefined,{email:email.trim(),password}) as Session;
      if (!result.user?.id || !result.token || !sessionValid(result)) throw new Error('Sessão recebida inválida.');
      if(sessionRef.current && result.user.id!==sessionRef.current.user.id) throw new Error('Renove com a mesma conta para preservar suas propostas.');
      const cached=parseStoredState(await AsyncStorage.getItem(storageKey(result.user.id)));
      await writeSession(JSON.stringify({...result,apiUrl:API_URL}));
      sessionRef.current=result;setSession(result);stateRef.current=cached;setLocal(cached);setNeedsLogin(false);
    } catch(cause) { setError(cause instanceof Error?cause.message:'Não foi possível entrar.');throw cause; }
    finally {authLock.current=false;setLoading(false);}
  }
  async function logout() {
    if(syncLock.current || authLock.current)throw new Error('Aguarde a sincronização terminar.');
    authLock.current=true;setLoading(true);
    try {
      await writeChain.current;
      const current=sessionRef.current;
      if(current)await request('/auth/logout',current.token,{}).catch(()=>{});
      await clearSession();sessionRef.current=null;setSession(null);stateRef.current=initialState();setLocal(stateRef.current);setError('');setNeedsLogin(false);
    } finally {authLock.current=false;setLoading(false);}
  }
  async function finalize(payload:Omit<QuickProposal,'clientId'>) {
    const signature=JSON.stringify(payload);
    const previous=stateRef.current.lastFinalized;
    const clientId=previous?.signature===signature?previous.clientId:Crypto.randomUUID();
    await change(state=>addToQueue(state,{...payload,clientId},signature));
    void sync();
  }
  return <Context.Provider value={{local,session,ready,loading,syncing,error,fatal,needsLogin,backgroundStatus,change,finalize,sync,login,logout}}>{children}</Context.Provider>;
}
export function useConnection() { const value=useContext(Context);if(!value)throw new Error('ConnectionProvider ausente.');return value; }
