import * as React from "react";
import { Button, Text, View, SafeAreaView, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "./AccountContext";
import socket from "../socket";

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);

  if (user.loggedIn === true) {
    React.useEffect(() => {
      socket.connect();
    }, []);
  } else {
    socket.disconnect();
  }

  const myUsername = user.username;
  const signOut = () => {
    SecureStore.deleteItemAsync("userToken");
    setUser({ loggedIn: false });
    socket.disconnect();
  };
  const { container } = styles;

  return (
    <SafeAreaView style={container}>
      <Text>Hello, {myUsername}! </Text>
      <Button title="Sign out" onPress={signOut} />
      <Text>
        Add button for user settings and signout on this screen (modal?)
      </Text>
      <Text>Add list of groups</Text>
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
