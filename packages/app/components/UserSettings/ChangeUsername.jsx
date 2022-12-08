import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { formSchema, newPasswordSchema } = require("@whatsapp-clone/common");
import { Formik, ErrorMessage } from "formik";

export default function ChangeUsernameScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.backButton}>
        <Button
          title="< Settings"
          onPress={() => navigation.navigate("Settings")}
        />
      </View>
      <View style={globalStyles.container}>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={formSchema}
          onSubmit={(values, actions) => {
            const vals = { ...values };
            const newusername = vals.username;
            const passattempt = vals.password;
            actions.resetForm();
            fetch("http://localhost:4000/settings/updateusername", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...user, newusername, passattempt }),
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
        >
          {(props) => (
            <View>
              <Text>{error}</Text>
              <Text>Please enter your password to verify your identity</Text>
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
              <Text>Please enter your desired new username</Text>
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

              <Button title="Update Username" onPress={props.handleSubmit} />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
