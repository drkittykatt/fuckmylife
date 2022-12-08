import * as React from "react";
import { Button, TextInput, View, Text, Alert } from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { addMessageSchema } = require("@whatsapp-clone/common");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import socket from "../../socket";

export default function ChatScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
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
      console.log("is this even doing anything");
      setChats(jsonData);
      getChats();
    });
  }, [socket]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.backButton}>
        <Button title="< Home" onPress={() => navigation.navigate("Home")} />
      </View>
      <View style={{ marginVertical: -27 }}></View>
      <View style={globalStyles.topRightButton}>
        <Button
          title="Me"
          onPress={() => Alert.alert("add user/admin dashboard here")}
        />
      </View>
      <View style={globalStyles.container}>
        <View style={globalStyles.topView}>
          <Text style={globalStyles.headerText}>
            Group (id: {user.currentGroup})
          </Text>
          <View style={globalStyles.fixToText}>
            <Button title="Chats" />
            <Button
              title="Posts"
              onPress={() => Alert.alert("add posts here")}
            />
          </View>
        </View>
        {chats &&
          chats.map((chats) => {
            return (
              <View key={chats.messages_id}>
                <Text>
                  {chats.text} ~{chats.sender_username}
                </Text>
              </View>
            );
          })}
        <View style={globalStyles.bottomView}>
          <Formik
            initialValues={{ mymessage: "" }}
            validationSchema={addMessageSchema}
            // add validation to make sure character limits are not exceeded for both entries
            // add validation to make sure the message isn't null
            onSubmit={(values, actions) => {
              const vals = { ...values };
              const uservals = { ...user, ...values };
              console.log("user submitted this message: " + vals.mymessage);
              actions.resetForm();
              socket.emit("insert msg return updated list", uservals);
            }}
          >
            {(props) => (
              <View>
                <Text>{error}</Text>
                <Text>Send message</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="my message..."
                  onChangeText={props.handleChange("mymessage")}
                  value={props.values.mymessage}
                  marginBottom={10}
                />
                <Text>
                  <ErrorMessage name="mymessage" />
                </Text>
                <Button title="Send message" onPress={props.handleSubmit} />
              </View>
            )}
          </Formik>
        </View>
      </View>
    </View>
  );
}
