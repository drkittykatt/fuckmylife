import * as React from "react";
import { Button, TextInput, View, Text, StyleSheet, Alert } from "react-native";
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
      <Text>Here is your chat for this group with id: {user.currentGroup}</Text>

      {/* now add list of messages here */}

      <Text>-------------------------------------------</Text>
      {chats &&
        chats.map((chats) => {
          //chats or messages here? chats.text or messages.text?
          return (
            <View key={chats.messages_id}>
              <Text>
                {chats.text} ~{chats.sender_username}
              </Text>
            </View>
          );
        })}
      <View style={styles.bottomView}>
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
            // fetch("http://localhost:4000/groupchat/addmessage", {
            //   method: "POST",
            //   credentials: "include",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({ ...user, ...vals }),
            // })
            //   .catch((err) => {
            //     return;
            //   })
            //   .then((res) => {
            //     if (!res || !res.ok || res.status >= 400) {
            //       return;
            //     }
            //     return res.json();
            //   })
            //   .then((data) => {
            //     if (!data) return;
            //     console.log(data);
            //     setUser({ ...data });
            //     if (data.status) {
            //       setError(data.status);
            //     } else if (data.loggedIn) {
            //       SecureStore.setItemAsync("token", data.token);
            //     }
            //   });
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bottomView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: 10, //Here is the trick
  },
});
