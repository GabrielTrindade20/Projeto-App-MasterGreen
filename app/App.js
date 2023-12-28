import { StyleSheet, Text, View, StatusBar, SafeAreaView, ScrollView } from 'react-native';

import Header from './src/components/Header'
import InfoInicial from './src/components/componentes orçamentos/InfoInicial';
import Metragem from './src/components/componentes orçamentos/Metragem';
import Servico from './src/components/componentes orçamentos/Servico'
import ValorFinal from './src/components/componentes orçamentos/ValorFinal';

export default function App() {
  return (
    <ScrollView>
      <SafeAreaView style={{
        backgroundColor: '#002B17',
        flex: 1,
        marginTop: StatusBar.currentHeight || 0
      }}>

        <Header />
        <InfoInicial />
        <Metragem />
        <Servico />
        <ValorFinal />

      </SafeAreaView>
    </ScrollView>
  );
}

