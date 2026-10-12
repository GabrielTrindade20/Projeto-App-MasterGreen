import * as SecureStore from 'expo-secure-store';
const key = 'mastergreen.mobile.session.v1';
export const readSession = () => SecureStore.getItemAsync(key);
export const writeSession = (value: string) => SecureStore.setItemAsync(key, value);
export const clearSession = () => SecureStore.deleteItemAsync(key);
