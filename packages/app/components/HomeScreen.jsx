import * as React from "react";
import {
  Button,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { AccountContext } from "./AccountContext";
import socket from "../socket";
import { globalStyles } from "../styles/global";
import MyGroupsScreen from "./Groups/MyGroupsScreen";

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);

  if (user.loggedIn === true) {
    React.useEffect(() => {
      socket.connect();
    }, []);
  } else {
    socket.disconnect();
  }

  const getGroups = async () => {
    try {
      const response = await fetch("http://localhost:4000/groups/mygroups", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user }),
      });
      const jsonData = await response.json();

      setGroups(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getGroups();
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.topRightButton}>
        <Button title="Me" onPress={() => navigation.navigate("Settings")} />
      </View>
      <View style={globalStyles.container}>
        <View style={{ marginVertical: -230 }}></View>
        <Text style={globalStyles.headerText}>My groups</Text>
        <Text>{error}</Text>
        <Text>-------------------------------------------</Text>
        {groups &&
          groups.map((groups) => {
            return (
              <View key={groups.group_id}>
                <Text>{groups.name}</Text>
                <Button
                  title="See chats"
                  onPress={() => {
                    setUser({ ...user, currentGroup: groups.group_id }),
                      navigation.navigate("ChatScreen");
                  }}
                />
                <Text>-------------------------------------------</Text>
              </View>
            );
          })}
      </View>

      <View style={globalStyles.bottomView}>
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
              <Button
                title="Create new group"
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("CreateGroup");
                }}
              />
              <Button
                title="Join group with passcode"
                onPress={() => {
                  Alert.alert("to be added");
                }}
              />
              <Button
                title="View public groups"
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("ViewAllGroups");
                }}
              />
              <Button
                title="Take placement quiz"
                onPress={() => {
                  Alert.alert("to be added");
                }}
              />
              <View style={{ marginVertical: 20 }}></View>
              <Button title="< Back" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
        <View style={{ marginVertical: 40 }}>
          <View style={globalStyles.primaryButton}>
            <Button
              color="white"
              title="New group"
              onPress={() => {
                setModalVisible(true);
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
