// No seu componente Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from '../components/Header';
import Orcamento from '../screens/Orcamento';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Orcamento">
        <Stack.Screen name="Orcamento" component={Orcamento} options={{ headerShown: false }} />
        {/* Adicione outras telas conforme necessário */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
