import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';

import Header from './src/components/Header';
import Orcamento from './src/screens/Orcamento';
import InfoInicial from './src/components/InfoInicial';

export default function App() {
  return (
    <SafeAreaView style={{
      backgroundColor: '#002B17',
      flex: 1,
      marginTop: StatusBar.currentHeight || 0
    }}>

      <Header />
      <Orcamento />
      <InfoInicial />
    </SafeAreaView>
  );
}

