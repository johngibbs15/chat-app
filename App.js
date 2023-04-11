import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Start from './components/start';
import Chat from './components/chat';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Screen1">
                <Stack.Screen name="Start" component={Start} />
                <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
