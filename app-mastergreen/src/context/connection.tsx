import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

type MobileBootstrap = {
  user: { id: string; name: string; type: string; branch: string };
  settings: { invoicePercent: number };
  products: { id: string; name: string; pricePerM2: string; costPerM2?: string | null }[];
  customers: { id: string; name: string; phone: string; city: string }[];
};

type Connection = {
  data: MobileBootstrap | null;
  invoicePercent: number;
  loading: boolean;
  error: string;
  refresh: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
const PERCENT_CACHE_KEY = '@mastergreen/invoice-percent';
const ConnectionContext = createContext<Connection | null>(null);

async function request(path: string, options?: RequestInit) {
  if (!API_URL) throw new Error('Endereço do sistema não configurado no aplicativo.');
  try {
    return await fetch(`${API_URL}${path}`, { credentials: 'include', ...options });
  } catch {
    throw new Error('Não foi possível acessar o sistema. Confira a rede do celular.');
  }
}

export function ConnectionProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<MobileBootstrap | null>(null);
  const [invoicePercent, setInvoicePercent] = useState(4.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    const response = await request('/api/mobile/bootstrap');
    if (response.status === 401) { setData(null); return false; }
    if (!response.ok) throw new Error('O sistema não conseguiu carregar os dados.');
    const next = await response.json() as MobileBootstrap;
    if (!next.user?.id || !Array.isArray(next.products) || !Array.isArray(next.customers)) {
      throw new Error('O sistema enviou dados incompletos.');
    }
    setData(next);
    if (Number.isFinite(next.settings?.invoicePercent) && next.settings.invoicePercent >= 0 && next.settings.invoicePercent <= 100) {
      setInvoicePercent(next.settings.invoicePercent);
      await AsyncStorage.setItem(PERCENT_CACHE_KEY, String(next.settings.invoicePercent));
    }
    setError('');
    return true;
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PERCENT_CACHE_KEY);
        const cached = Number(stored);
        if (active && stored !== null && Number.isFinite(cached) && cached >= 0 && cached <= 100) setInvoicePercent(cached);
        if (active) await refresh();
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Falha de conexão.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [refresh]);

  async function login(email: string, password: string) {
    setLoading(true);
    setError('');
    try {
      const response = await request('/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (response.status === 401) throw new Error('E-mail ou senha incorretos.');
      if (!response.ok) throw new Error('Não foi possível entrar no sistema.');
      if (!(await refresh())) throw new Error('A sessão não foi mantida pelo celular. Tente conectar novamente.');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Falha de conexão.';
      setError(message);
      throw cause;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try { await request('/api/logout', { method: 'POST' }); }
    finally { setData(null); }
  }

  return <ConnectionContext.Provider value={{ data, invoicePercent, loading, error, refresh, login, logout }}>
    {children}
  </ConnectionContext.Provider>;
}

export function useConnection() {
  const connection = useContext(ConnectionContext);
  if (!connection) throw new Error('ConnectionProvider ausente.');
  return connection;
}
