import * as React from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function CreatePostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  return (
    <View style={globalStyles.container}>
      <View style={{ marginVertical: -5 }}></View>
      <View style={globalStyles.backButton}>
        <Button
          title="< Posts"
          onPress={() => navigation.navigate("PostScreen")}
        />
      </View>
      <View style={globalStyles.createPostContainer}>
        <Text>Welcome to the create post</Text>
        <Formik
          initialValues={{ title: "", body_text: "" }}
          // add validation to make sure character limits are not exceeded for both entries
          onSubmit={(values, actions) => {
            const vals = { ...values };
            console.log(vals);
            console.log({ ...user, ...vals });
            console.log("submit button triggered");
            actions.resetForm();
            fetch(
              `http://localhost:4000/groups/${user.currentGroup}/createpost`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...user, ...vals }),
              }
            )
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
              <Text>Post Title</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter post title"
                onChangeText={props.handleChange("title")}
                value={props.values.title}
                marginBottom={10}
              />
              {/* <Text>
              <ErrorMessage name="title" />
            </Text> */}
              <Text>Description</Text>
              <TextInput
                // make the text box larger? Make sure it's maximum 255 characters.
                style={globalStyles.inputLarge}
                multiline={true}
                placeholder="Enter text"
                onChangeText={props.handleChange("body_text")}
                value={props.values.body_text}
                marginBottom={10}
              />
              {/* <Text>
              <ErrorMessage name="body_text" />
            </Text> */}
              <Button title="Create post" onPress={props.handleSubmit} />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
