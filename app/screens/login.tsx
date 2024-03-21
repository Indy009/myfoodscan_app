import {
  ActivityIndicator,
  Button,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { auth } from "@/config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const handleSignup = async () => {
    navigation.navigate("Sign Up");
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      if (user) navigation.navigate("Home");
    } catch (error: any) {
      setLoading(false);
      const typedError = error as { code: string; message: string };
      if (
        typedError.code === "auth/user-not-found" ||
        typedError.code === "auth/wrong-password"
      ) {
        alert("Invalid email or password. Please try again.");
      } else if (typedError.code === "auth/too-many-requests") {
        alert("Too many unsuccessful login attempts. Please try again later.");
      } else {
        alert("Sign-in error: " + typedError.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.image}
        />
        <Text style={styles.heading}>Sign In</Text>
        <View>
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
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>

        <StatusBar style="auto" />
      </View>
      <View style={styles.route}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={handleSignup}>
          <Text style={{ color: "#356ec3" }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
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
