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
import socket from "../../socket";
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen({ navigation }) {
  const [actionTriggered, setActionTriggered] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const myUsername = user.username;
  const changeUsername = null;

  const signOut = () => {
    SecureStore.deleteItemAsync("userToken");
    setUser({ loggedIn: false });
    socket.disconnect();
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{ marginVertical: -20 }}></View>
      <View style={globalStyles.backButton}>
        <Button title="< Home" onPress={() => navigation.navigate("Home")} />
      </View>
      <View style={globalStyles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(false);
          }}
        >
          <View style={globalStyles.centeredView}>
            {actionTriggered === "DELETE_MODAL_1" ? (
              <View style={globalStyles.modalView}>
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
        <Text style={globalStyles.headerText}>Hi {myUsername}!</Text>
        <Text style={{ padding: 20 }}>
          Insert some key analytics here and add a button to see more detailed
          analytics
        </Text>
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
        <Button title="Sign out" onPress={signOut} />
        <Button
          title="Delete Account"
          onPress={() => {
            setActionTriggered("DELETE_MODAL_1");
            setModalVisible(true);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
