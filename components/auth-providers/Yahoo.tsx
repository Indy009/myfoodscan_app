import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AuthProviderButton from "../AuthProviderButton";

export default function Yahoo() {
  async function signInWithYahoo() {}
  return <AuthProviderButton type="yahoo" onPress={signInWithYahoo} />;
}

const styles = StyleSheet.create({});
