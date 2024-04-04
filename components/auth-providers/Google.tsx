import React from "react";
import { Alert, StyleSheet } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AuthProviderButton from "@/components/AuthProviderButton";
import { auth } from "@/config/firebaseConfig"; // Ensure you have the correct path
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID, //  web client ID from Firebase console
});

async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, googleCredential);
    // Sign-in successful
  } catch (error) {
    console.error(error);
    // Handle errors here
  }
}

const handleGoogleSignIn = () => {
  signInWithGoogle();
};

export default function Google() {
  return <AuthProviderButton type="google" onPress={handleGoogleSignIn} />;
}
const styles = StyleSheet.create({});
