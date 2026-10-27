import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Action, Card, Field, Screen, Text, green, ui } from '@/components/mastergreen-ui';
import { useConnection } from '@/context/connection';

function PasswordField({ value, onChangeText }: { value: string; onChangeText: (next: string) => void }) {
  const { local } = useConnection();
  const [visible, setVisible] = useState(false);
  return (
    <View style={ui.field}>
      <Text style={ui.label}>Senha</Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          accessibilityLabel="Senha"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoComplete="current-password"
          placeholderTextColor="#67746A"
          style={[
            ui.input,
            { paddingRight: 60, fontSize: 22 * local.preferences.fontScale },
            local.preferences.highContrast && { color: '#000', borderColor: '#000' },
          ]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          onPress={() => setVisible((prev) => !prev)}
          hitSlop={10}
          style={{ position: 'absolute', right: 8, top: 0, bottom: 0, width: 48, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={26} color={local.preferences.highContrast ? '#000' : green} />
        </Pressable>
      </View>
    </View>
  );
}

export function LoginForm() {
  const {login,loading,syncing,session,error}=useConnection();
  const [email,setEmail]=useState(session?.user.email||'');
  const [password,setPassword]=useState('');
  const [message,setMessage]=useState('');
  return <Card title={session?'Renovar acesso':'Bem-vindo à MasterGreen'}>
    <Text style={ui.label}>Entre uma vez e mantenha seu acesso por 30 dias.</Text>
    <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
    <PasswordField value={password} onChangeText={setPassword} />
    <Action title={loading?'Entrando…':'Entrar'} disabled={loading||syncing||!email.trim()||!password} onPress={()=>{
      setMessage('');void login(email,password).then(()=>setPassword('')).catch(cause=>setMessage(cause.message));
    }} />
    {!!(message||error)&&<Text accessibilityRole="alert" style={ui.message}>{message||error}</Text>}
    <Text style={ui.label}>O primeiro acesso precisa de internet. A senha não fica salva no aplicativo.</Text>
  </Card>;
}
export default function LoginScreen(){return <Screen title="MasterGreen" settings={false}><LoginForm /></Screen>;}
