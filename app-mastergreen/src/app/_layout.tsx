import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { green, Card, Screen, Text, ui } from '@/components/mastergreen-ui';
import { ConnectionProvider, useConnection } from '@/context/connection';
import LoginScreen from '@/screens/login-screen';

export default function TabLayout() {
  return <ConnectionProvider><AppContent /></ConnectionProvider>;
}
function AppContent() {
  const {ready,fatal,session}=useConnection();
  return <ThemeProvider value={DefaultTheme}>
    <StatusBar style="light" />
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: green }}>
      {!ready||fatal?<Screen title="MasterGreen" settings={false}><Card><Text style={ui.label}>{fatal||'Abrindo seus dados…'}</Text></Card></Screen>:!session?<LoginScreen />:<Tabs initialRouteName="index" screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#138600',
        tabBarInactiveTintColor: '#59675D',
        tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
        tabBarItemStyle: { minHeight: 64, paddingVertical: 5 },
        tabBarStyle: { minHeight: 72, backgroundColor: '#fff' },
        tabBarHideOnKeyboard: true,
      }}>
        <Tabs.Screen name="index" options={{ title: 'Orçamento', tabBarLabel:'Orçar', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'clipboard' : 'clipboard-outline'} color={color} size={size} /> }} />
        <Tabs.Screen name="clientes" options={{ title: 'Clientes', tabBarIcon: ({ color,size }) => <Ionicons name="people-outline" color={color} size={size} /> }} />
        <Tabs.Screen name="historico" options={{ title: 'Histórico', tabBarIcon: ({ color,size }) => <Ionicons name="time-outline" color={color} size={size} /> }} />
        <Tabs.Screen name="resumo" options={{ title: 'Resumo', tabBarIcon: ({ color,size }) => <Ionicons name="bar-chart-outline" color={color} size={size} /> }} />
        <Tabs.Screen name="proposta" options={{ href:null }} />
        <Tabs.Screen name="configuracoes" options={{ href:null }} />
        <Tabs.Screen name="sistema" options={{ href:null }} />
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>}
    </SafeAreaView>
  </ThemeProvider>;
}
