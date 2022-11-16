import * as React from "react";
import { Button, Text, View, SafeAreaView, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
// import { AuthContext } from "./utils";
import { AccountContext } from "./AccountContext";

export default function HomeScreen({ navigation }) {
  const { setUser } = React.useContext(AccountContext);
  // const { signOut } = React.useContext(AccountContext);
  const signOut = () => {
    SecureStore.deleteItemAsync("userToken");
    setUser({ loggedIn: false });
  };
  const { container } = styles;

  return (
    <SafeAreaView style={container}>
      <Text>Home screen!</Text>
      <Button title="Sign out" onPress={signOut} />
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
