import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Home from "../(home)/_layout";
import QuestionnaireScreen from "../screens/questionnaire";

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />
    </Stack.Navigator>
  );
}
