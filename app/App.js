import React from "react";
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// import Screens from './src/components/navigation/Screens'
import Header from "./src/components/Header";
import Orcamento from './src/screens/Orcamento';
import Tab from "./src/components/navigation/Tab";

// No seu componente App
export default () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#002B17" />
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Tab />
        </NavigationContainer>
      </SafeAreaView>
    </View>
  );
}


