import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { green } from '@/components/mastergreen-ui';
import { ConnectionProvider } from '@/context/connection';

export default function TabLayout() {
  return <ConnectionProvider><ThemeProvider value={DefaultTheme}>
    <StatusBar style="light" />
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: green }}>
      <Tabs initialRouteName="index" screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#138600',
        tabBarInactiveTintColor: '#59675D',
        tabBarLabelStyle: { fontSize: 18, fontWeight: 'bold' },
        tabBarItemStyle: { minHeight: 64, paddingVertical: 5 },
        tabBarStyle: { minHeight: 72, backgroundColor: '#fff' },
        tabBarHideOnKeyboard: true,
      }}>
        <Tabs.Screen name="index" options={{ title: 'Orçamento', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'clipboard' : 'clipboard-outline'} color={color} size={size} /> }} />
        <Tabs.Screen name="proposta" options={{ title: 'Proposta', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'reader' : 'reader-outline'} color={color} size={size} /> }} />
        <Tabs.Screen name="sistema" options={{ title: 'Sistema', tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'cloud-done' : 'cloud-outline'} color={color} size={size} /> }} />
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  </ThemeProvider></ConnectionProvider>;
}
