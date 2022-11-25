import * as React from "react";
import { Text, View, SafeAreaView, StyleSheet, Button } from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "../AccountContext";

// add password verification before deleting. May want to use Formik

export default function DeleteAccountScreen() {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  const deleteAccount = () => {
    fetch("http://localhost:4000/settings/delete", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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
  };
  const { container } = styles;

  return (
    <SafeAreaView style={container}>
      <Text>Delete your account here! Coming soon :D</Text>
      <Button
        title="Delete account permanently and Sign out"
        onPress={deleteAccount}
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
