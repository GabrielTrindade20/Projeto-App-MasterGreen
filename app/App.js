import React from "react";
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// import Screens from './src/components/navigation/Screens'
import Header from "./src/components/Header";
import Orcamento from './src/screens/Orcamento';

// No seu componente App
export default () => {
  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
      <NavigationContainer>
        <Header />  
        <Orcamento />
        {/* <Screens /> */}
      </NavigationContainer>
    </SafeAreaView>
  );
}


