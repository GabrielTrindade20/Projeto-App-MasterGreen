import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Orcamento from '../screens/Orcamento'

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Orcamento"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#002B17', // Cor de fundo da barra de navegação
          },
          headerTintColor: '#fff', // Cor dos ícones e do texto na barra de navegação
        }}
      >
        <Stack.Screen
          name="null"
          component={Orcamento}
          options={{
            headerShown: false,
          }}
        />
        {/* Adicione outras telas principais conforme necessário */}
      </Stack.Navigator>
    </NavigationContainer>

  );
}
