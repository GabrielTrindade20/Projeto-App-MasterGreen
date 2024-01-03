import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Orcamento from "../../screens/Orcamento";
import Header from "../Header";
import Campo from "../../screens/Campo";
import Proposta from "../../screens/Proposta";

const Tab = createBottomTabNavigator()


export default props => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: 'red',
      tabBarInactiveTintColor: 'blue',
      tabBarShowLabel: true,
      tabBarLabelStyle: { fontSize: 18, fontWeight: 'bold' },
      tabBarStyle: {
        display: "flex",
        height: 60
      },

      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Orçamento':
            iconName = focused
              ? 'clipboard'
              : 'clipboard-outline';
            break;
          case 'Campo':
            iconName = focused
              ? 'ios-football'
              : 'ios-football-outline';
            break;
          case 'Proposta':
            iconName = focused
              ? 'reader'
              : 'reader-outline';
            break;
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'green',
      tabBarInactiveTintColor: 'gray',
    })} initialRouteName='Orcamento'>
    <Tab.Screen
      name="Orçamento"
      component={Orcamento}
      options={{
        title: 'Orçamento',
        header: ({ navigation, route }) => (
          <Header title='Orçamento' navigation={navigation} route={route} />
        ),
      }}
    />
    <Tab.Screen
      name="Campo"
      component={Campo}
      options={{
        title: 'Campo',
        header: ({ navigation, route }) => (
          <Header title='Orçamento Campo' navigation={navigation} route={route} />
        ),
      }}
    />
    <Tab.Screen
      name="Proposta"
      component={Proposta}
      options={{
        title: 'Proposta',
        header: ({ navigation, route }) => (
          <Header title='Proposta' navigation={navigation} route={route} />
        ),
      }}
    />

  </Tab.Navigator>
)   