import { StyleSheet, TouchableOpacity } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import React from "react";

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Call the signOut function from firebaseConfig
      navigation.navigate("Sign In"); // Use replace to prevent going back to the profile after logging out
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle the logout error (e.g., show an error message)
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
  },
});
