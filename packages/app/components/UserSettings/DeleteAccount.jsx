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
const { formSchema } = require("@whatsapp-clone/common");
import { Formik, ErrorMessage } from "formik";

export default function DeleteAccountScreen() {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  return (
    <View style={globalStyles.container}>
      <Formik
        initialValues={{ password: "" }}
        validationSchema={formSchema}
        onSubmit={(values, actions) => {
          const vals = { ...values };
          const passattempt = vals.password;
          actions.resetForm();
          fetch("http://localhost:4000/settings/delete", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...user, passattempt }),
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
                SecureStore.deleteItemAsync("userToken");
                setUser({ loggedIn: false });
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

            <Button
              title="Delete account permanently and Sign out"
              onPress={props.handleSubmit}
            />
          </View>
        )}
      </Formik>
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
