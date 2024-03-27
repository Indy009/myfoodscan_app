import { Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { PenIcon, PencilIcon } from "lucide-react-native";

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dietaryRestrictions: {},
  });

  const fetchUserDetails = async (user: User) => {
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      setUserDetails({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dietaryRestrictions: data.dietaryRestrictions || {},
      });
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      fetchUserDetails(user);
    }
  });

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
      <View style={styles.header}>
        <View>
          <TouchableOpacity style={styles.editIcon}>
            <PencilIcon color="#fff" />
          </TouchableOpacity>
          <Image
            style={styles.image}
            source={require("@/assets/images/default_pfp.jpg")}
          />
        </View>

        <Text style={styles.profileName}>
          {userDetails.firstName} {userDetails.lastName}
        </Text>
      </View>

      <View>
        <Text>Personal Information</Text>
        <Text>Email Address</Text>
        <TextInput placeholder="current value for email" />
        <Text>Password</Text>
        <TextInput placeholder="current value for password" />
      </View>

      <View>
        <Text>Settings</Text>
        <Text>Dark mode</Text>
        <Text>Dietary Preferences</Text>
      </View>

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
  header: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 200,
    width: 300,
    resizeMode: "contain",
  },
  editIcon: {
    position: "absolute",
    zIndex: 99,
    bottom: 0,
    right: 70,
    backgroundColor: "#3bc44b",
    padding: 8,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 10,
    marginBottom: 40,
    fontSize: 32,
    fontWeight: "700",
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
