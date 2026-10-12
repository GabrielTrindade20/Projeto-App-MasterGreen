import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, Card, Screen, Text, ui } from '@/components/mastergreen-ui';
import { ConnectionProvider, useConnection } from '@/context/connection';
import LoginScreen from '@/screens/login-screen';
import { LoadingNotice, NavigationFeedbackProvider, useNavigationFeedback } from '@/context/navigation-feedback';

export default function TabLayout() {
  return <ConnectionProvider><NavigationFeedbackProvider><AppContent /></NavigationFeedbackProvider></ConnectionProvider>;
}
function AppContent() {
  const {ready,fatal,session}=useConnection();
  const {start,finish}=useNavigationFeedback();
  return <ThemeProvider value={DefaultTheme}>
    <StatusBar style="dark" />
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      {!ready||fatal?<Screen title="MasterGreen" settings={false}>{fatal?<Card><Text style={ui.label}>{fatal}</Text></Card>:<LoadingNotice label="Abrindo seus dados…"/>}</Screen>:!session?<LoginScreen />:<Tabs initialRouteName="index" screenListeners={({navigation,route})=>({
        tabPress:event=>{
          const state=navigation.getState();
          if(state.routes[state.index]?.key===route.key)return;
          event.preventDefault();start(()=>navigation.navigate(route.name));
        },
        focus:finish,
      })} screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#167341',
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
