import { useState } from 'react';
import { Action, Card, Field, Screen, Text, ui } from '@/components/mastergreen-ui';
import { useConnection } from '@/context/connection';

export function LoginForm() {
  const {login,loading,syncing,session,error}=useConnection();
  const [email,setEmail]=useState(session?.user.email||'');
  const [password,setPassword]=useState('');
  const [message,setMessage]=useState('');
  return <Card title={session?'Renovar acesso':'Bem-vindo à MasterGreen'}>
    <Text style={ui.label}>Entre uma vez e mantenha seu acesso por 30 dias.</Text>
    <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
    <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" />
    <Action title={loading?'Entrando…':'Entrar'} disabled={loading||syncing||!email.trim()||!password} onPress={()=>{
      setMessage('');void login(email,password).then(()=>setPassword('')).catch(cause=>setMessage(cause.message));
    }} />
    {!!(message||error)&&<Text accessibilityRole="alert" style={ui.message}>{message||error}</Text>}
    <Text style={ui.label}>O primeiro acesso precisa de internet. A senha não fica salva no aplicativo.</Text>
  </Card>;
}
export default function LoginScreen(){return <Screen title="MasterGreen" settings={false}><LoginForm /></Screen>;}
