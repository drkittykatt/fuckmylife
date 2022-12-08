import * as React from "react";
import {
  Button,
  Text,
  View,
  SafeAreaView,
  Modal,
  Alert,
  FlatList,
  StyleSheet,
  StatusBar,
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

  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
    },
    { id: "1", title: "fourth" },
    { id: "2", title: "alsdkjfsdf" },
    { id: "10", title: "fourtadfdsfh" },
    { id: "100", title: "fourasdfth" },
    { id: "1000", title: "fourasdfth" },
    { id: "10000", title: "fourasdadsffth" },
  ];

  const Item = ({ title, id }) => (
    <View style={styles.item}>
      <Button
        title={title}
        color="#333"
        onPress={() => {
          setUser({ ...user, currentGroup: id, groupName: title }),
            navigation.navigate("ChatScreen");
        }}
      />
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.name} id={item.group_id} />
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.topRightButton}>
        <Button
          title={user.username}
          onPress={() => navigation.navigate("Settings")}
        />
      </View>
      <Text style={globalStyles.headerText}>My groups</Text>
      <View style={styles.container}>
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    marginBottom: 150,
  },
  item: {
    backgroundColor: "#cdcdcd",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
