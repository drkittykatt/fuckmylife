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
      <View style={{ marginVertical: -230 }}></View>
      <Text style={globalStyles.headerText}>My groups</Text>
      <Text>{error}</Text>
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
