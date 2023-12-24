import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CheckList from '../screens/CheckListLocal';
import CheckListLocal from '../screens/screensCheckListLocal/CheckListLocal';


const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="CheckList" component={CheckList} />
      <Tab.Screen name="CheckListLocal" component={CheckListLocal} />
    </Tab.Navigator>
  );
}
