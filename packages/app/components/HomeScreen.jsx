import * as React from "react";
import { Button, Text, View, SafeAreaView, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "./AccountContext";
import socket from "../socket";
import { globalStyles } from "../styles/global";

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);

  if (user.loggedIn === true) {
    React.useEffect(() => {
      socket.connect();
    }, []);
  } else {
    socket.disconnect();
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.topRightButton}>
        <Button title="Me" onPress={() => navigation.navigate("Settings")} />
      </View>

      <View style={globalStyles.container}>
        <View style={{ marginVertical: -280 }}></View>
        <Text style={globalStyles.headerText}>My groups</Text>
        <Text>Add list of groups with infinite scroll</Text>
        <Button title="New group" />
      </View>
    </SafeAreaView>
  );
}
