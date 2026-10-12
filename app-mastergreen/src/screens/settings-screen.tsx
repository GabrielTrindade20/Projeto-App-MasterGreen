import { useState } from 'react';
import Constants from 'expo-constants';
import { Action, Card, Screen, Text, ui } from '@/components/mastergreen-ui';
import { API_URL, useConnection } from '@/context/connection';
import { LoginForm } from './login-screen';
import { SyncStatus } from './consultation-screens';

export default function SettingsScreen(){
  const {local,session,needsLogin,sync,syncing,loading,change,logout,backgroundStatus}=useConnection();
  const [confirm,setConfirm]=useState(false);const [error,setError]=useState('');
  const prefs=local.preferences;const pending=local.queue.filter(row=>!row.sentAt);
  const changePref=(update:Partial<typeof prefs>)=>void change(state=>({...state,preferences:{...state.preferences,...update}})).catch(()=>{});
  return <Screen title="Configurações" back settings={false}><SyncStatus />
    <Card title="Minha conta"><Text style={ui.label}>{session?.user.name}</Text><Text style={ui.label}>{session?.user.email}</Text><Text style={ui.label}>Acesso até {session?new Date(session.expiresAt).toLocaleDateString('pt-BR'):''}</Text></Card>
    {needsLogin&&<LoginForm />}
    <Card title="Sincronização"><Action title={syncing?'Sincronizando…':'Sincronizar agora'} disabled={syncing||loading||needsLogin} onPress={()=>void sync()} />
      <Text style={ui.label}>Rede permitida: {prefs.mobileData?'Wi-Fi e dados móveis':'Somente Wi-Fi'}</Text>
      <Action title={prefs.mobileData?'Usar somente Wi-Fi':'Permitir dados móveis'} onPress={()=>changePref({mobileData:!prefs.mobileData})} />
      <Text style={ui.label}>Envio em segundo plano: {backgroundStatus}</Text>
      <Text style={ui.label}>Ao recuperar a conexão, abrir o app garante uma nova tentativa. O Android pode adiar ou impedir tarefas com o app fechado.</Text>
      <Text style={ui.label}>Conectado ao sistema: {API_URL||'Não configurado'}</Text>
    </Card>
    <Card title="Dados no celular"><Text style={ui.label}>{local.queue.length} propostas guardadas · {pending.length} pendentes</Text><Text style={ui.label}>{local.data?.customers.length||0} clientes disponíveis para consulta</Text>
      <Text style={ui.label}>O banco oficial é acessado pelo sistema web, nunca diretamente pelo celular. Não desinstale nem limpe os dados do app antes de sincronizar.</Text>
      {pending.filter(row=>row.error).map(row=><Text key={row.payload.clientId} style={ui.message}>{row.payload.customer.name}: {row.error}</Text>)}
    </Card>
    <Card title="Leitura e aparência"><Text style={ui.label}>Prévia: textos grandes e botões fáceis de tocar.</Text>
      <Action title={prefs.fontScale===1?'Texto: grande (selecionado)':'Usar texto grande'} onPress={()=>changePref({fontScale:1})} />
      <Action title={prefs.fontScale===1.2?'Texto: extragrande (selecionado)':'Usar texto extragrande'} onPress={()=>changePref({fontScale:1.2})} />
      <Action title={prefs.highContrast?'Desativar alto contraste':'Ativar alto contraste'} onPress={()=>changePref({highContrast:!prefs.highContrast})} />
    </Card>
    <Card title="Sobre e suporte"><Text style={ui.label}>MasterGreen · versão {Constants.expoConfig?.version||'1.0.0'}</Text><Text style={ui.label}>Para suporte, informe a versão, o horário e a mensagem de erro à Lumitech. Nunca envie sua senha.</Text></Card>
    {!!error&&<Card><Text style={ui.message}>{error}</Text></Card>}
    {confirm?<Card title="Sair desta conta?"><Text style={ui.label}>{pending.length} proposta(s) pendente(s) permanecerão neste celular. Será necessário entrar novamente com a mesma conta e internet.</Text>
      <Action title="Confirmar saída" danger disabled={loading||syncing} onPress={()=>void logout().catch(cause=>setError(cause.message))} />
      <Action title="Continuar no aplicativo" onPress={()=>setConfirm(false)} /></Card>:<Action title="Sair da conta" danger disabled={loading||syncing} onPress={()=>setConfirm(true)} />}
  </Screen>;
}
