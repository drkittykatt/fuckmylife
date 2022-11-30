import * as React from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSchema } = require("@whatsapp-clone/common");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function GeneralGroupScreen({ navigation }) {
  const { setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  return (
    <View style={globalStyles.container}>
      <Text>
        Welcome to the general group screen. To be added: links to the other
        stuff.
      </Text>
      <Button
        title="Create Group"
        onPress={() => {
          navigation.navigate("CreateGroup");
        }}
      />
      <Button
        title="Join Existing Group"
        onPress={() => {
          navigation.navigate("JoinGroup");
        }}
      />
      <Button
        title="All Groups"
        onPress={() => {
          navigation.navigate("ViewAllGroups");
        }}
      />
      <Button
        title="My Groups"
        onPress={() => {
          navigation.navigate("ViewMyGroups");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
