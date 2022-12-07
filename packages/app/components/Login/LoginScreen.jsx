import * as React from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { formSchema } = require("@whatsapp-clone/common");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen({ navigation }) {
  const { setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.backButton}>
        <Button title="< Home" onPress={() => navigation.navigate("Splash")} />
      </View>
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
              <View style={{ marginVertical: -50 }}></View>
              <Text style={globalStyles.headerText}>Log in</Text>
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
                      title="Sign up"
                      onPress={() => navigation.navigate("SignUp")}
                    />
                  </View>
                  <View style={globalStyles.primaryLoginButton}>
                    <Button
                      title="Log in"
                      color="#fdfdfd"
                      onPress={props.handleSubmit}
                    />
                  </View>
                </View>
                <View style={{ marginVertical: 10 }}></View>
                <Button
                  title="Forgot password?"
                  onPress={() => {
                    navigation.navigate("ForgotPasswordLoggedOut");
                  }}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
