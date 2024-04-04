import React from "react";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import AuthProviderButton from "@/components/AuthProviderButton";
import { auth } from "@/config/firebaseConfig";
import { OAuthProvider, signInWithCredential } from "firebase/auth";

export default function Apple() {
  async function signInWithApple() {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identity token
      if (!appleAuthRequestResponse.identityToken) {
        throw "Apple Sign-In failed - no identity token returned";
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = new OAuthProvider("apple.com").credential({
        idToken: identityToken,
        rawNonce: nonce,
      });

      // Sign the user in with the credential
      await signInWithCredential(auth, appleCredential);

      // User is signed in to Firebase with Apple.
      // You can now navigate the user to your app's main flow
      console.log("Apple sign-in successful!");
    } catch (error) {
      console.error("Apple sign-in error:", error);
    }
  }

  // Check if Apple Sign-In is supported on the device before rendering the button
  if (!appleAuth.isSupported) return null;

  return <AuthProviderButton type="apple" onPress={signInWithApple} />;
}
