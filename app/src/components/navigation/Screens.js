import React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Orcamento from '../../screens/Orcamento';
import Proposta from '../../screens/Proposta';
import Header from '../Header';

const Drawer = createDrawerNavigator();

export const drawerStyles = StyleSheet.create({
    drawerContainer: {
        backgroundColor: '#FFF',
        paddingTop: 50,
    },
    drawerLabelStyle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "#000"
    },
});


export default () => (
    <Drawer.Navigator
        initialRouteName="Orçamento"
        screenOptions={({ route }) => ({
            header: ({ navigation }) => <Header navigation={navigation} route={route} />,
            drawerStyle: drawerStyles.drawerContainer,            
        })}
    >
        <Drawer.Screen name="Orçamento" component={Orcamento} options={{ drawerLabel: 'Orçamento', drawerLabelStyle: drawerStyles.drawerLabelStyle }} />
        <Drawer.Screen name="Proposta" component={Orcamento} options={{ drawerLabel: 'Proposta', drawerLabelStyle: drawerStyles.drawerLabelStyle }} />
    </Drawer.Navigator>
);
