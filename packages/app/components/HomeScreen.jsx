import * as React from "react";
import {
  Button,
  Text,
  View,
  SafeAreaView,
  Modal,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AccountContext } from "./AccountContext";
import socket from "../socket";
import { globalStyles } from "../styles/global";

export default function HomeScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [groups, setGroups] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const myUsername = user.username;

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

  const Item = ({ title, id }) => (
    <View style={globalStyles.item}>
      <TouchableOpacity
        style={globalStyles.primaryButton}
        onPress={() => {
          setUser({ ...user, currentGroup: id, groupName: title }),
            navigation.navigate("ChatScreen");
        }}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
      <Text>Insert latest messages here?</Text>
      <Text>Notifications?</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.name} id={item.group_id} />
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity
          style={globalStyles.smallButton}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={globalStyles.smallButtonText}>{myUsername}</Text>
        </TouchableOpacity>
        <Text style={globalStyles.groupHeaderText}>My groups</Text>
        <TouchableOpacity
          style={globalStyles.smallButton}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={globalStyles.smallButtonText}>
            {"  "}New{"  "}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.innerContainer}>
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={(item) => item.group_id}
        />
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
      </View>
    </SafeAreaView>
  );
}
