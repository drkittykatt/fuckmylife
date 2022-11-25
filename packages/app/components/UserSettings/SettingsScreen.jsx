import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Button,
  Modal,
  TextInput,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";

export default function SettingsScreen({ navigation }) {
  const [actionTriggered, setActionTriggered] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const myUsername = user.username;
  const changeUsername = null;
  const { container } = styles;

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

  return (
    <SafeAreaView style={container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          {actionTriggered === "DELETE_MODAL_1" ? (
            <View style={styles.modalView}>
              <Text>
                Are you sure you want to PERMANENTLY delete your account? This
                action cannot be undone.
              </Text>
              <Button
                title="No, go back"
                onPress={() => setModalVisible(false)}
              />
              <Button
                title="Yes!! Let me delete!! 😡"
                onPress={() => {
                  setActionTriggered("DELETE_MODAL_2");
                  setModalVisible(true);
                }}
              />
            </View>
          ) : actionTriggered === "DELETE_MODAL_2" ? (
            <View style={styles.modalView}>
              <Text>{error}</Text>
              <Text>Ok enter your password then.</Text>
              {/* enter form here  */}
              <TextInput
                style={globalStyles.input}
                placeholder="Enter Password"
                // onChangeText={props.handleChange("password")}
                // value={props.values.password}
                secureTextEntry={true}
                marginBottom={10}
              />
              <Button title="Back" onPress={() => setModalVisible(false)} />
              <Button
                title="Reset my password 😅"
                onPress={() => {
                  setActionTriggered("DELETE_MODAL_3");
                  setModalVisible(true);
                }}
              />
              <Button
                title="Delete account 🫡"
                onPress={() => {
                  onPress = { deleteAccount };
                }}
              />
            </View>
          ) : actionTriggered === "DELETE_MODAL_3" ? (
            <View style={styles.modalView}>
              <Text>
                Okie password reset in progress. Look out for an email to the
                address associated with this account.
              </Text>
              <Text>TO BE IMPLEMENTED.</Text>

              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          ) : null}
        </View>
      </Modal>
      <Text>{myUsername}'s Account Settings</Text>
      <Button
        title="Change Username"
        onPress={() => {
          setModalVisible(false);
          navigation.navigate("ChangeUsernameScreen");
        }}
      />
      <Button title="Change Password" onPress={changeUsername} />
      <Button title="Forgot Password" onPress={changeUsername} />
      <Button
        title="Delete Account"
        onPress={() => {
          setActionTriggered("DELETE_MODAL_1");
          setModalVisible(true);
        }}
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
