import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
const { forgotPasswordSchema } = require("@whatsapp-clone/common");
import { Formik, ErrorMessage } from "formik";

export default function ForgotPasswordScreen({}) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  const generatePasscode = () => {
    const myNumber = Math.random().toString(10).substring(2, 8);
    const mypasscode = myNumber;
    fetch("http://localhost:4000/settings/generatepasscode", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user, mypasscode }),
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
  };

  return (
    <View style={globalStyles.container}>
      <View>
        <Text>
          Click the button below to recieve a 6 digit passcode to the email
          associated with this account. Enter the 6 digit passcode below and
          then a new password 😘
        </Text>
        <Button title="Get 6 digit code" onPress={generatePasscode} />
      </View>
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
            <Text>{error}</Text>
            <Text>Enter the 6 digit passcode</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter Passcode"
              onChangeText={props.handleChange("passcode")}
              value={props.values.passcode}
              marginBottom={10}
            />
            <Text>
              <ErrorMessage name="passcode" />
            </Text>
            <Text>Please enter your desired new password</Text>
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
            <Text>Please enter your desired new password again</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter new password again"
              onChangeText={props.handleChange("passattempt2")}
              value={props.values.passattempt2}
              marginBottom={10}
            />
            <Text>
              <ErrorMessage name="passattempt2" />
            </Text>
            <Button title="Reset Password" onPress={props.handleSubmit} />
          </View>
        )}
      </Formik>
    </View>
  );
}
