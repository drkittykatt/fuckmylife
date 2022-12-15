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

export default function PostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [posts, setPosts] = React.useState([]);

  const groupTitleButton = user.groupName;

  const getPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/groups/${user.currentGroup}/posts`,
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

      setPosts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getPosts();
  }, []);

  const Item = ({ title, id, body }) => (
    <View style={globalStyles.item}>
      <TouchableOpacity
        style={globalStyles.primaryButton}
        onPress={() => {
          // setUser({ ...user, currentGroup: id, groupName: title }),
          //   navigation.navigate("ChatScreen");
          Alert.alert("go to post with id: " + id);
        }}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
      <Text numberOfLines={2} ellipsizeMode="tail">
        {body}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} id={item.post_id} body={item.body_text} />
  );

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
          onPress={() => navigation.navigate("CreatePost")}
        >
          <Text style={globalStyles.smallButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.chatContainer}>
        <Text>
          Insert posts here. click each post to see it. It should look like a
          subreddit.
        </Text>

        <View style={globalStyles.innerContainer}>
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.post_id}
          />
        </View>
      </View>
    </View>
  );
}
