import React from "react";
import { View, Button, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'


export default ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.openDrawer()                        
                    }}
                    
                >
                    <Icon name="bars" size={35} color="black" style={{marginTop: 15}}/> 
                    
                </TouchableOpacity>
            </View>
        </View>
    )
};