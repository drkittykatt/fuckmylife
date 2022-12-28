import * as React from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { forgotPasswordSchema } = require("@whatsapp-clone/common");
import { Formik, ErrorMessage } from "formik";

export default function ForgotPasswordLoggedOut({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.backButton}>
        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={globalStyles.secondaryButtonText}>{"< "} Login</Text>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.innerContainer}>
        <Text style={globalStyles.headerText}>Forgot password</Text>

        <Text
          style={{
            color: "red",
            textAlign: "center",
            width: "80%",
          }}
        >
          {error}
        </Text>

        <View style={globalStyles.container2}>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              actions.resetForm();
              const myNumber = Math.random().toString(10).substring(2, 8);
              const mypasscode = myNumber;
              const email = vals.email;
              fetch("http://localhost:4000/settings/generatepasscode", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...user, email, mypasscode }),
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
                <View style={{ marginVertical: -35 }}></View>

                <Text>Email</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Enter Email"
                  onChangeText={props.handleChange("email")}
                  value={props.values.email}
                  marginBottom={10}
                />

                <View>
                  <TouchableOpacity
                    style={globalStyles.primaryButton}
                    onPress={props.handleSubmit}
                  >
                    <Text style={globalStyles.primaryButtonText}>
                      Send passcode
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
          <View style={{ marginVertical: 20 }}></View>
          <Formik
            initialValues={{ passcode: "", passattempt1: "", passattempt2: "" }}
            validationSchema={forgotPasswordSchema}
            onSubmit={(values, actions) => {
              const vals = { ...values };
              actions.resetForm();
              fetch("http://localhost:4000/settings/forgotpassword", {
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
                    console.log("no errors I guess");
                  }
                });
            }}
          >
            {(props) => (
              <View>
                <Text>Passcode</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Enter 6 digit passcode"
                  onChangeText={props.handleChange("passcode")}
                  value={props.values.passcode}
                  marginBottom={10}
                />
                <Text>
                  <ErrorMessage name="passcode" />
                </Text>
                <Text>New password</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Enter new password"
                  onChangeText={props.handleChange("passattempt1")}
                  value={props.values.passattempt1}
                  marginBottom={10}
                />
                <Text>
                  <ErrorMessage name="passattempt1" />
                </Text>
                <Text>New password</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Repeat new password"
                  onChangeText={props.handleChange("passattempt2")}
                  value={props.values.passattempt2}
                  marginBottom={10}
                />
                <Text>
                  <ErrorMessage name="passattempt2" />
                </Text>

                <View>
                  <TouchableOpacity
                    style={globalStyles.primaryButton}
                    onPress={props.handleSubmit}
                  >
                    <Text style={globalStyles.primaryButtonText}>
                      Reset password
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </View>
  );
}
