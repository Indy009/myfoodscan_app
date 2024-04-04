import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Home from "../(home)/_layout";
import QuestionnaireScreen from "../screens/questionnaire";

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Questionnaire"
        component={QuestionnaireScreen}
      />
    </Stack.Navigator>
  );
}
