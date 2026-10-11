import { useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { Action, Card, Field, Screen, ui } from '@/components/mastergreen-ui';
import { useConnection } from '@/context/connection';

function SystemContent() {
  const { data, invoicePercent, loading, error, refresh, login, logout } = useConnection();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [actionError, setActionError] = useState('');

  return <>
    <Card title="Conexão com o sistema">
      <Text style={ui.label}>{data ? `Conectado como ${data.user.name}` : 'Entre com sua conta MasterGreen para ver os dados do sistema.'}</Text>
      {loading && <ActivityIndicator accessibilityLabel="Carregando conexão" size="large" color="#138600" />}
      {!!(actionError || error) && <Text accessibilityRole="alert" style={ui.message}>{actionError || error}</Text>}
    </Card>
    {data ? <>
      <Card title="Dados disponíveis">
        <Text style={ui.label}>{data.products.length} produtos</Text>
        <Text style={ui.label}>{data.customers.length} clientes acessíveis</Text>
        <Text style={ui.label}>Nota fiscal: {invoicePercent}%</Text>
      </Card>
      <Action title="Atualizar dados" disabled={loading} onPress={() => void refresh().catch((cause) => setActionError(cause instanceof Error ? cause.message : 'Falha ao atualizar.'))} />
      <Action title="Sair do sistema" danger disabled={loading} onPress={() => void logout().catch(() => setActionError('Não foi possível encerrar a sessão no servidor.'))} />
    </> : <Card title="Entrar">
      <Field label="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field label="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      <Action title="Conectar" disabled={loading || !email.trim() || !password} onPress={() => {
        setActionError('');
        void login(email, password).then(() => setPassword('')).catch(() => {});
      }} />
    </Card>}
    <Card><Text style={ui.label}>O orçamento rápido e o PDF continuam disponíveis sem conexão.</Text></Card>
  </>;
}

export default function SystemScreen() {
  return <Screen title="Sistema"><SystemContent /></Screen>;
}
