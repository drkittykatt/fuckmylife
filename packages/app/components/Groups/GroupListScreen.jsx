import * as React from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSchema } = require("@whatsapp-clone/common");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function GroupListScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);

  const getGroups = async () => {
    try {
      const response = await fetch("http://localhost:4000/groups/getgroups", {
        credentials: "include",
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
      <Text>{error}</Text>
      <Text>These are the names of all the groups:</Text>
      <Text>-------------------------------------------</Text>

      {groups &&
        groups.map((groups) => {
          return (
            <View>
              <Text>{groups.name}</Text>
              <Button
                title="Join group"
                onPress={() => {
                  const joinGroupId = groups.groups_id;
                  fetch("http://localhost:4000/groups/joingroup", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...user, joinGroupId }),
                  })
                    .catch((err) => {
                      return;
                    })
                    .then((res) => {
                      if (!res || !res.ok || res.status >= 400) {
                        return;
                      }
                      return res.json();
                    })
                    .then((data) => {
                      if (!data) return;
                      console.log(data);
                      setUser({ ...data });
                      if (data.status) {
                        setError(data.status);
                      } else if (data.loggedIn) {
                        console.log("no errors I guess");
                      }
                    });
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
