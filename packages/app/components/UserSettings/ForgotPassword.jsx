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
const { forgotPasswordSchema } = require("@whatsapp-clone/common");
import { Formik, ErrorMessage } from "formik";

export default function ForgotPasswordScreen({}) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [truePasscode, setTruePasscode] = React.useState(null);

  return (
    <View style={globalStyles.container}>
      <Formik
        initialValues={{ passcode: "", passattempt1: "", passattempt2: "" }}
        validationSchema={forgotPasswordSchema}
        onSubmit={(values, actions) => {
          const vals = { ...values };
          console.log("SECOND button clicked");
          React.useEffect(() => {
            if (truePasscode) {
              console.log("this is from the effect hook" + truePasscode);
              truePasscode = truePasscode;
            }
          }, [id]);
          console.log(truePasscode);
          console.log(vals.passcode);
          const validatePasscode = vals.passcode === truePasscode;
          console.log("the output of validatePasscode is: " + validatePasscode);
          if (vals.passcode == truePasscode) {
            console.log("the passcodes match!!");
          } else {
            console.log("they don't match ;(");
          }
          //   console.log({ ...user, ...vals });
          // actions.resetForm();

          //   if (actionTriggered === "SUBMIT_1") {
          //     const vals = { ...values };
          //     console.log("first button clicked!");
          //     console.log({ ...user, ...vals });
          //   } else if (actionTriggered === "SUBMIT_2") {
          //     const vals = { ...values };
          //     console.log("SECOND button clicked");
          //     console.log(truePasscode);
          //     if (vals.passcode == truePasscode) {
          //       console.log("the passcodes match!!");
          //     } else {
          //       console.log("they don't match ;(");
          //     }
          //     console.log({ ...user, ...vals });
          //     actions.resetForm();
          //   } else {
          //     console.log("something bad happened");
          //   }

          //   const vals = { ...values };
          //   console.log("hello from submit button");
          //   console.log(truePasscode);
          //   console.log({ ...user, ...vals });
          //   actions.resetForm();
          //   fetch("http://localhost:4000/settings/forgotpassword", {
          //     method: "POST",
          //     credentials: "include",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({ ...user, ...vals }),
          //   })
          //     .catch((err) => {
          //       return;
          //     })
          //     .then((res) => {
          //       if (!res || !res.ok || res.status >= 400) {
          //         return;
          //       }
          //       return res.json();
          //     })
          //     .then((data) => {
          //       if (!data) return;
          //       console.log(data);
          //       setUser({ ...data });
          //       if (data.status) {
          //         setError(data.status);
          //       } else if (data.loggedIn) {
          //         console.log("no errors I guess");
          //       }
          //     });
        }}
      >
        {(props) => (
          <View>
            <Text>{error}</Text>
            <Text>
              Click the button below to recieve a 6 digit passcode to the email
              associated with this account. Enter the 6 digit passcode below and
              then a new password 😘
            </Text>
            <Button
              // I think I need to do two different handleSubmits for this.
              // let formik take care of all this...
              title="Get 6 digit code"
              onPress={() => {
                let myNumber = Math.random().toString(10).substring(2, 8);
                console.log("the passcode generated for you is: " + myNumber);
                setTruePasscode(myNumber);
              }}
            />
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
            {/* <Button
              title="Reset Password"
              onPress={() => {
                setActionTriggered("SUBMIT_2");
                console.log("hello from reset password button");
              }} */}
          </View>
        )}
      </Formik>
    </View>
  );
}
