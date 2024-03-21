import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "@/config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const handleLogin = async () => {
    navigation.navigate("Sign In");
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        firstName: firstname,
        lastName: lastname,
        email: email,
      });
      console.log("Signup successful, user:", user);
      setLoading(false);
      // navigation.navigate("Questionnaire");
    } catch (error) {
      console.error("Error during signup or user details addition:", error);
      setLoading(false);
      alert(
        `Signup error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.image}
          />
          <Text style={styles.heading}>Create Account</Text>
          <View>
            <Text style={{ marginTop: 8 }}>First Name</Text>
            <TextInput
              value={firstname}
              style={styles.input}
              placeholder="First Name"
              onChangeText={(text) => setFirstname(text)}
            />
            <Text style={{ marginTop: 8 }}>Last Name</Text>
            <TextInput
              value={lastname}
              style={styles.input}
              placeholder="First Name"
              onChangeText={(text) => setLastname(text)}
            />
            <Text style={{ marginTop: 8 }}>Email</Text>
            <TextInput
              value={email}
              style={styles.input}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
            />
            <Text style={{ marginTop: 8 }}>Password</Text>
            <TextInput
              secureTextEntry={true}
              value={password}
              style={styles.input}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
            />
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handleSignup}
              >
                <Text style={styles.buttonText}>Signup</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.route}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={{ color: "#356ec3" }}>Log In</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    justifyContent: "center",
    flex: 1,
  },
  heading: {
    alignSelf: "center",
    marginBottom: 24,
    fontSize: 28,
  },
  image: {
    alignSelf: "center",
    transform: [{ scale: 0.5 }],
  },
  input: {
    marginVertical: 6,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    width: "auto",
    marginVertical: 10,
    padding: 12,
    backgroundColor: "#356ec3",
    borderRadius: 8,
  },
  buttonText: {
    alignSelf: "center",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 16,
  },
  route: {
    marginHorizontal: 20,
    marginBottom: 30,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
