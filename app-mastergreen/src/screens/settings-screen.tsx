import { useState } from 'react';
import Constants from 'expo-constants';
import { Switch, View } from 'react-native';
import { Action, Card, Choice, Screen, Section, Text, ui } from '@/components/mastergreen-ui';
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
      <View style={ui.row}><View style={{flex:1,gap:6}}><Text style={ui.label}>Permitir dados móveis</Text><Text style={ui.muted}>{prefs.mobileData?'Wi-Fi e dados móveis':'Somente Wi-Fi'}</Text></View><Switch accessibilityLabel="Permitir dados móveis" value={prefs.mobileData} onValueChange={value=>changePref({mobileData:value})} trackColor={{true:'#167341'}}/></View>
      <Text style={ui.muted}>Ao recuperar a conexão, abrir o app garante uma nova tentativa de envio.</Text>
    </Card>
    <Section title="Dados no celular" summary={`${local.queue.length} propostas · ${pending.length} pendentes`}><Text style={ui.label}>{local.data?.customers.length||0} clientes disponíveis para consulta</Text>
      <Text style={ui.muted}>Não desinstale nem limpe os dados do app antes de sincronizar. Rascunhos e cópias originais ficam neste aparelho. Propostas enviadas, incluindo seus itens, ficam disponíveis no sistema web.</Text>
      {pending.filter(row=>row.error).map(row=><Text key={row.payload.clientId} style={ui.message}>{row.payload.customer.name}: {row.error}</Text>)}
    </Section>
    <Card title="Leitura e aparência"><Text style={ui.label}>Prévia: textos grandes e botões fáceis de tocar.</Text>
      <View style={ui.wrap}><Choice title="Grande" selected={prefs.fontScale===1} onPress={()=>changePref({fontScale:1})}/><Choice title="Extragrande" selected={prefs.fontScale===1.2} onPress={()=>changePref({fontScale:1.2})}/></View>
      <View style={ui.row}><Text style={[ui.label,{flex:1}]}>Alto contraste</Text><Switch accessibilityLabel="Alto contraste" value={prefs.highContrast} onValueChange={value=>changePref({highContrast:value})} trackColor={{true:'#167341'}}/></View>
    </Card>
    <Section title="Sobre e suporte" summary={'MasterGreen · versão '+(Constants.expoConfig?.version||'1.0.0')}><Text style={ui.muted}>Para suporte, informe a versão, o horário e a mensagem de erro à Lumitech. Nunca envie sua senha.</Text><Text style={ui.muted}>Servidor: {API_URL||'Não configurado'}</Text><Text style={ui.muted}>Segundo plano: {backgroundStatus}. O Android pode adiar tarefas com o app fechado.</Text><Text style={ui.muted}>O banco é acessado pelo web; o celular não armazena credenciais do PostgreSQL.</Text></Section>
    {!!error&&<Card><Text style={ui.message}>{error}</Text></Card>}
    {confirm?<Card title="Sair desta conta?"><Text style={ui.label}>{pending.length} proposta(s) pendente(s) permanecerão neste celular. Será necessário entrar novamente com a mesma conta e internet.</Text>
      <Action title="Confirmar saída" danger disabled={loading||syncing} onPress={()=>void logout().catch(cause=>setError(cause.message))} />
      <Action title="Continuar no aplicativo" onPress={()=>setConfirm(false)} /></Card>:<Action title="Sair da conta" danger disabled={loading||syncing} onPress={()=>setConfirm(true)} />}
  </Screen>;
}
