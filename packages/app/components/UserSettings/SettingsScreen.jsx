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
import ChangePasswordScreen from "./ChangePassword";

export default function SettingsScreen({ navigation }) {
  const [actionTriggered, setActionTriggered] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const myUsername = user.username;
  const changeUsername = null;
  const { container } = styles;

  return (
    <SafeAreaView style={container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(false);
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
                  setModalVisible(false);
                  navigation.navigate("DeleteScreen");
                }}
              />
            </View>
          ) : actionTriggered === "DELETE_MODAL_4" ? (
            setModalVisible(false)
          ) : null}
        </View>
      </Modal>
      <Text>{myUsername}'s Account Settings</Text>
      <Button
        title="Change Username"
        onPress={() => {
          navigation.navigate("ChangeUsernameScreen");
        }}
      />
      <Button
        title="Change Password"
        onPress={() => {
          navigation.navigate("ChangePasswordScreen");
        }}
      />
      <Button
        title="Forgot Password"
        onPress={() => {
          navigation.navigate("ForgotPasswordLoggedIn");
        }}
      />
      <Button
        title="Forgot Password 2"
        onPress={() => {
          navigation.navigate("ForgotPassword2");
        }}
      />
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
