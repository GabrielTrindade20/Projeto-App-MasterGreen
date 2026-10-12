// Prévia no navegador: sessão restrita à aba. No Android usa SecureStore.
const key = 'mastergreen.mobile.session.v1';
export const readSession = async () => typeof window === 'undefined' ? null : sessionStorage.getItem(key);
export const writeSession = async (value: string) => { sessionStorage.setItem(key,value); };
export const clearSession = async () => { sessionStorage.removeItem(key); };
