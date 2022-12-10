import * as React from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
const { addMessageSchema } = require("@whatsapp-clone/common");
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import socket from "../../socket";

export default function PostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [chats, setChats] = React.useState([]);

  const groupTitleButton = user.groupName;

  return (
    <View style={globalStyles.container}>
      <View style={{ marginTop: 50 }}></View>
      <View style={globalStyles.header}>
        <TouchableOpacity
          style={globalStyles.smallButton}
          onPress={() => navigation.navigate("ChatScreen")}
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
          onPress={() => Alert.alert("New post form")}
        >
          <Text style={globalStyles.smallButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.chatContainer}>
        <Text>
          Insert posts here. click each post to see it. It should look like a
          subreddit.
        </Text>
      </View>
    </View>
  );
}
