import * as React from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSignupSchema } = require("@whatsapp-clone/common");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function SignUpScreen({ navigation }) {
  const { setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.backButton}>
        <Button title="< Home" onPress={() => navigation.navigate("Splash")} />
      </View>
      <View style={globalStyles.container}>
        <Formik
          initialValues={{ email: "", username: "", password: "" }}
          validationSchema={formSignupSchema}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            console.log(values);
            actions.resetForm();
            fetch("http://localhost:4000/auth/signup", {
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
                setUser({ ...data });
                if (data.status) {
                  setError(data.status);
                } else if (data.loggedIn) {
                  // navigate("/home");
                  SecureStore.setItemAsync("token", data.token);
                }
              });
          }}
        >
          {(props) => (
            <View>
              <View style={{ marginVertical: -50 }}></View>
              <Text style={globalStyles.headerText}>Sign up</Text>
              <View style={{ marginVertical: 5 }}></View>
              <View style={{ marginHorizontal: 30 }}>
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
                <View style={{ marginVertical: 10 }}></View>
                <Text>Email</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Enter email"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                  marginBottom={10}
                />
                <Text>
                  <ErrorMessage name="email" />
                </Text>
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
                <View style={globalStyles.fixToText}>
                  <View style={globalStyles.secondaryButton}>
                    <Button
                      title="Log in"
                      onPress={() => navigation.navigate("Login")}
                    />
                  </View>
                  <View style={{ marginHorizontal: 15 }}></View>
                  <View style={globalStyles.primaryButton}>
                    <Button
                      title="Create account"
                      color="#fdfdfd"
                      onPress={props.handleSubmit}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
