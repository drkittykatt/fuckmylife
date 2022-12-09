import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Button,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AccountContext } from "../AccountContext";
import { globalStyles } from "../../styles/global";
import socket from "../../socket";
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { user, setUser } = React.useContext(AccountContext);
  const myUsername = user.username;

  const signOut = () => {
    SecureStore.deleteItemAsync("userToken");
    setUser({ loggedIn: false });
    socket.disconnect();
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.backButton}>
        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={globalStyles.secondaryButtonText}>{"< "} Groups</Text>
        </TouchableOpacity>
      </View>

      <View>
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
            <View style={globalStyles.modalView}>
              <Text style={{ textAlign: "center" }}>
                Are you sure you want to PERMANENTLY delete your account? This
                action cannot be undone.
              </Text>
              <View style={{ marginTop: 10 }}></View>
              <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={globalStyles.primaryButtonText}>No, go back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("DeleteScreen");
                }}
              >
                <Text style={globalStyles.secondaryButtonText}>
                  Yes!! Let me delete!! 😡
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{ marginVertical: 40 }}></View>
        <Text style={globalStyles.headerText}>Hi {myUsername}!</Text>
        <View style={globalStyles.innerContainer}>
          <View style={{ marginVertical: 20 }}></View>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              Alert.alert("to be added");
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>My stats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              navigation.navigate("ChangeUsernameScreen");
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>
              Change username
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              navigation.navigate("ChangePasswordScreen");
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>
              Change password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              navigation.navigate("ForgotPassword");
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>
              Forgot password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={signOut}
          >
            <Text style={globalStyles.secondaryButtonText}>Sign out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={globalStyles.secondaryButtonText}>Delete account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
