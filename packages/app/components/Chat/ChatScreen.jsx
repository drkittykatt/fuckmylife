import * as React from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { addMessageSchema } = require("@whatsapp-clone/common");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import socket from "../../socket";

export default function ChatScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [chats, setChats] = React.useState([]);

  const getChats = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/groupchat/getmessages",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...user }),
        }
      );
      const jsonData = await response.json();

      setChats(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getChats();
  }, []);

  React.useEffect(() => {
    socket.on("insert msg return updated list", (jsonData) => {
      setChats(jsonData);
      getChats();
    });
  }, [socket]);

  const groupTitleButton = user.groupName;

  const Item = ({ text, username, id }) => (
    <View style={globalStyles.chatItem}>
      <Text>
        {text} ~{username}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      text={item.text}
      username={item.sender_username}
      id={item.messages_id}
    />
  );

  return (
    <View style={globalStyles.container}>
      <View style={{ marginTop: 50 }}></View>
      <View style={globalStyles.header}>
        <TouchableOpacity
          style={globalStyles.smallButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={globalStyles.smallButtonText}>{"  <  "}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => Alert.alert("go to Chat Info screen")}
        >
          <Text style={globalStyles.primaryButtonText}>{groupTitleButton}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.smallButton}
          onPress={() => navigation.navigate("PostScreen")}
        >
          <Text style={globalStyles.smallButtonText}>Posts</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.chatContainer}>
        <FlatList
          data={chats}
          renderItem={renderItem}
          keyExtractor={(item) => item.messages_id}
          inverted
        />
      </View>

      <View style={globalStyles.bottomView}>
        <Formik
          // need title and message - hashtags????? Add those later??????
          initialValues={{ mymessage: "" }}
          validationSchema={addMessageSchema}
          // add validation to make sure character limits are not exceeded for both entries
          // add validation to make sure the message isn't null
          onSubmit={(values, actions) => {
            const vals = { ...values };
            const uservals = { ...user, ...values };
            actions.resetForm();
            socket.emit("insert msg return updated list", uservals);
          }}
        >
          {(props) => (
            <View>
              <Text>{error}</Text>
              <Text style={{ textAlign: "center" }}>
                <ErrorMessage name="mymessage" />
              </Text>
              <View style={globalStyles.buttonContainer}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Send message..."
                  onChangeText={props.handleChange("mymessage")}
                  value={props.values.mymessage}
                  marginBottom={10}
                />
                <TouchableOpacity
                  style={globalStyles.sendButton}
                  onPress={props.handleSubmit}
                >
                  <Text style={globalStyles.primaryButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
