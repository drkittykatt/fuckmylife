import * as React from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSchema } = require("@whatsapp-clone/common");

export default function LoginScreen({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={formSchema}
        onSubmit={(values, actions) => {
          const vals = { ...values };
          console.log(values);
          actions.resetForm();
          fetch("http://localhost:4000/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(vals),
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
            });
        }}
      >
        {(props) => (
          <View>
            <Text>Username</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter username"
              onChangeText={props.handleChange("username")}
              value={props.values.username}
              marginBottom={10}
            />
            <Text>
              <ErrorMessage name="username" />
            </Text>
            <Text>Password</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter Password"
              onChangeText={props.handleChange("password")}
              value={props.values.password}
              secureTextEntry={true}
              marginBottom={10}
            />
            <Text>
              <ErrorMessage name="password" />
            </Text>
            <View style={styles.fixToText}>
              <Button title="Log In" onPress={props.handleSubmit} />
              <Button
                title="Create Account"
                onPress={() => navigation.navigate("SignUp")}
              />
            </View>
          </View>
        )}
      </Formik>
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
