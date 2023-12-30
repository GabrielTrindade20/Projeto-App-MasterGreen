import { StyleSheet, Text, View, StatusBar, SafeAreaView, ScrollView } from 'react-native';

import Header from './src/components/Header'
import Orcamento from './src/components/componentes orçamentos/Orcamento'

export default function App() {
  return (
    <ScrollView>
      <SafeAreaView style={{
        backgroundColor: '#002B17',
        flex: 1,
        marginTop: StatusBar.currentHeight || 0
      }}>

        <Header />

        <Orcamento />

      </SafeAreaView>
    </ScrollView>
  );
}

