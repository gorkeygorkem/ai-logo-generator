// navigation/StackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InputScreen from '../screens/InputScreen';
import OutputScreen from '../screens/OutputScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Input">
      <Stack.Screen
        name="Input"
        component={InputScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Output"
        component={OutputScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
