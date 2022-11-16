import * as React from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";

export default function SettingsScreen() {
  const { container } = styles;

  return (
    <SafeAreaView style={container}>
      <Text>Settings screen!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
