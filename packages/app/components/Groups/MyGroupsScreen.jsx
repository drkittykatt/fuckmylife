import * as React from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSchema } = require("@whatsapp-clone/common");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function MyGroupsScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);

  const getGroups = async () => {
    try {
      const response = await fetch("http://localhost:4000/groups/mygroups", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user }),
      });
      const jsonData = await response.json();

      setGroups(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getGroups();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text>
        See the list of groups you're in here. (If you don't belong to any
        groups , Show a message saying no groups yet, would you like to join a
        group or create a new group?). Also add a button to be taken to the chat
        screen for that group.
      </Text>
      <Text>-------------------------------------------</Text>
      <Text>{error}</Text>
      <Text>These are the names of all the groups you belong to :</Text>
      <Text>-------------------------------------------</Text>
      {groups &&
        groups.map((groups) => {
          return (
            <View key={groups.group_id}>
              <Text>{groups.name}</Text>
              <Button
                title="See chats"
                onPress={() => {
                  setUser({ ...user, currentGroup: groups.group_id }),
                    navigation.navigate("ChatScreen");
                }}
              />
              <Text>-------------------------------------------</Text>
            </View>
          );
        })}
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
