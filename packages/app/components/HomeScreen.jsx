import * as React from "react";
import { Button, Text, View, SafeAreaView, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "./AccountContext";
import useSocketSetup from "./useSocketSetup";
const { io } = require("socket.io-client");

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const socket = io();
  //useSocketSetup; // do I want this here or just the chat screen?

  const myUsername = user.username;
  const signOut = () => {
    SecureStore.deleteItemAsync("userToken");
    setUser({ loggedIn: false });
  };
  const { container } = styles;

  return (
    <SafeAreaView style={container}>
      <Text>Hello, {myUsername}! </Text>
      <Button title="Sign out" onPress={signOut} />
      <Button title="Detail" onPress={() => navigation.navigate("Detail")} />
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
