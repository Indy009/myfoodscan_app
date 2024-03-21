import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import HistoryScreen from "./history";
import ScannerScreen from "./scanner";
import ProfileScreen from "./profile";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function FA5Icon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome5 size={24} style={{ marginBottom: -3 }} {...props} />;
}

const Tab = createBottomTabNavigator();

export default function Home() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      initialRouteName="scanner"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="history"
        component={HistoryScreen}
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <FA5Icon name="history" color={color} />,
        }}
      />
      <Tab.Screen
        name="scanner"
        component={ScannerScreen}
        options={{
          title: "Scanner",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="barcode-outline"
              color={color}
              size={30}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <FA5Icon name="user" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
