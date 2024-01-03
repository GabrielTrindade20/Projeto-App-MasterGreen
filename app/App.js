import React from "react";
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// import Screens from './src/components/navigation/Screens'
import Header from "./src/components/Header";
import Orcamento from './src/screens/Orcamento';
import Tab from "./src/components/navigation/Tab";

// No seu componente App
export default () => {
  return (
    <SafeAreaView>
      <NavigationContainer>
        {/* <Header />  
        <Orcamento /> */}
        {/* <Screens /> */}
        <Tab />
      </NavigationContainer>
    </SafeAreaView>
  );
}


