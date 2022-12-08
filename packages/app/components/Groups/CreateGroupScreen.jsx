import * as React from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function CreateGroupScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  return (
    <View style={globalStyles.container}>
      <View style={{ marginVertical: -5 }}></View>
      <View style={globalStyles.backButton}>
        <Button title="< Home" onPress={() => navigation.navigate("Home")} />
      </View>
      <View>
        <Text>Welcome to the create group</Text>
        <Formik
          initialValues={{ groupname: "", description: "" }}
          // add validation to make sure character limits are not exceeded for both entries
          onSubmit={(values, actions) => {
            const vals = { ...values };
            console.log("submit button triggered");
            actions.resetForm();
            fetch("http://localhost:4000/groups/creategroup", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...user, ...vals }),
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
                  SecureStore.setItemAsync("token", data.token);
                }
              });
          }}
        >
          {(props) => (
            <View>
              <Text>{error}</Text>
              <Text>Group Name</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter group name"
                onChangeText={props.handleChange("groupname")}
                value={props.values.groupname}
                marginBottom={10}
              />
              {/* <Text>
              <ErrorMessage name="groupname" />
            </Text> */}
              <Text>Description</Text>
              <TextInput
                // make the text box larger? Make sure it's maximum 255 characters.
                style={globalStyles.input}
                placeholder="Enter description"
                onChangeText={props.handleChange("description")}
                value={props.values.description}
                marginBottom={10}
              />
              {/* <Text>
              <ErrorMessage name="description" />
            </Text> */}
              <Button title="Create Group" onPress={props.handleSubmit} />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
