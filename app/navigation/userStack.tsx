import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Home from "../(home)/_layout";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
