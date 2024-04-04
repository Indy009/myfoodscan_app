import React from "react";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import AuthProviderButton from "@/components/AuthProviderButton";
import { auth } from "@/config/firebaseConfig";
import { FacebookAuthProvider, signInWithCredential } from "firebase/auth";

export default function Facebook() {
  async function signInWithFacebook() {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        throw "User cancelled the login process";
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw "Something went wrong obtaining access token";
      }

      const facebookCredential = FacebookAuthProvider.credential(
        data.accessToken
      );

      await signInWithCredential(auth, facebookCredential);
      // User is signed in to Firebase with Facebook. Navigate or update state as needed.
    } catch (error) {
      console.error("Facebook sign-in error:", error);
    }
  }

  return <AuthProviderButton type="facebook" onPress={signInWithFacebook} />;
}
