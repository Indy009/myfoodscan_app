import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/login";
import RegisterScreen from "../screens/register";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Sign In" component={LoginScreen} />
      <Stack.Screen name="Sign Up" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
