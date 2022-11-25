import * as React from "react";
import { Text, View, SafeAreaView, StyleSheet, Button } from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "../AccountContext";

// add password verification before updating. May want to use Formik

export default function ChangeUsernameScreen() {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  const newUsername = "abcdefg";
  const updateUsername = () => {
    const newusername = newUsername;
    console.log(user);
    console.log("update username activated from front");
    fetch("http://localhost:4000/settings/updateusername", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user, newusername }),
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
  const { container } = styles;

  return (
    <SafeAreaView style={container}>
      <Text>Change your username! bells and whistles coming soon :D</Text>
      <Button
        title="Change Username to something hard coded"
        onPress={updateUsername}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
