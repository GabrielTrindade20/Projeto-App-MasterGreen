import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import * as Network from 'expo-network';
import { parseStoredState, sessionValid, type Session } from './mobile-state';
import { readSession } from './session-store';

const TASK='mastergreen-send-pending-v1';
const api=(process.env.EXPO_PUBLIC_API_URL||'').replace(/\/$/,'');
if(!TaskManager.isTaskDefined(TASK))TaskManager.defineTask(TASK,async()=>{
  try {
    const raw=await readSession();if(!raw)return BackgroundTask.BackgroundTaskResult.Success;
    const session=JSON.parse(raw) as Session & {apiUrl:string};
    if(session.apiUrl!==api||!sessionValid(session)||(!__DEV__&&!api.startsWith('https://')))return BackgroundTask.BackgroundTaskResult.Success;
    const key='@mastergreen/v1/'+api+'/'+session.user.id;
    const state=parseStoredState(await AsyncStorage.getItem(key));
    const receipts=new Set<string>(JSON.parse(await AsyncStorage.getItem(key+'/background-receipts')||'[]'));
    const network=await Network.getNetworkStateAsync();
    if(!network.isConnected||(!state.preferences.mobileData&&network.type!==Network.NetworkStateType.WIFI&&network.type!==Network.NetworkStateType.ETHERNET))return BackgroundTask.BackgroundTaskResult.Success;
    // Não escreve no estado local: evita disputar gravações com o formulário.
    // Ao retornar, o app confirma os mesmos IDs idempotentes e atualiza o histórico.
    for(const row of state.queue.filter(item=>!item.sentAt&&!item.error&&!receipts.has(item.payload.clientId)).slice(0,10)){
      if(await readSession()!==raw)break;
      const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
      try {
        const response=await fetch(api+'/api/mobile/proposals',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.token},body:JSON.stringify(row.payload),signal:controller.signal});
        if(response.status===401)break;
        if(!response.ok)return BackgroundTask.BackgroundTaskResult.Failed;
        receipts.add(row.payload.clientId);
        await AsyncStorage.setItem(key+'/background-receipts',JSON.stringify([...receipts]));
      }finally{clearTimeout(timer);}
    }
    return BackgroundTask.BackgroundTaskResult.Success;
  }catch{return BackgroundTask.BackgroundTaskResult.Failed;}
});
export async function enableBackgroundSync(){
  if(!await TaskManager.isAvailableAsync())return 'Indisponível nesta versão do Expo. Abra o app para enviar.';
  if(await BackgroundTask.getStatusAsync()===BackgroundTask.BackgroundTaskStatus.Restricted)return 'Restringido pelo aparelho. Abra o app para enviar.';
  if(!await TaskManager.isTaskRegisteredAsync(TASK))await BackgroundTask.registerTaskAsync(TASK,{minimumInterval:15});
  return 'Ativado. O Android decide quando executar; pode haver atraso.';
}
