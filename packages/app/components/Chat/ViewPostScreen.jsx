import * as React from "react";
import {
  TextInput,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import socket from "../../socket";

export default function ViewPostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  const [comments, setComments] = React.useState([]);

  const groupTitleButton = user.groupName;

  const getComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/groups/${user.currentGroup}/posts/${user.currentPost}/getcomments`,
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

      setComments(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    getComments();
  }, []);

  React.useEffect(() => {
    socket.on("insert comment return updated list", (jsonData) => {
      setComments(jsonData);
      getComments();
    });
  }, [socket]);

  const Item = ({ text, username }) => (
    <View style={globalStyles.item}>
      <Text>
        Comment: {text} ~{username}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item text={item.comment_text} username={item.sender_username} />
  );

  const addPostPoint = () => {
    console.log("adding a point");

    fetch(`http://localhost:4000/groups/addpostpoint`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user }),
    });
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.postHeaderContainer}>
        <View style={globalStyles.header}>
          <TouchableOpacity
            style={globalStyles.smallButton}
            onPress={() => navigation.navigate("PostScreen")}
          >
            <Text style={globalStyles.smallButtonText}>{"  <  "}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => Alert.alert("go to Chat Info screen")}
          >
            <Text style={globalStyles.primaryButtonText}>
              {groupTitleButton}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.smallButton}
            onPress={() => navigation.navigate("CreatePost")}
          >
            <Text style={globalStyles.smallButtonText}>New</Text>
          </TouchableOpacity>
        </View>
        <View style={globalStyles.postContainer}>
          <Text>
            Add post (with id: {user.currentPost} )here and then comments below,
            and an add comment input
          </Text>

          <Text>Title: {user.post_title}</Text>
          <Text>{user.post_body}</Text>

          <View style={{ marginTop: 50 }}></View>
          <Text>Points for this post: (insert here)</Text>
          <TouchableOpacity
            style={globalStyles.sendButton}
            // onPress={props.handleSubmit}
            // onPress={() => Alert.alert("Add a point here")}
            // onPress={() => console.log({ ...user })}
            onPress={addPostPoint}
          >
            <Text style={globalStyles.primaryButtonText}>
              Award Point to this Post
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 50 }}></View>
          <Text>comments: </Text>

          <FlatList
            data={comments}
            renderItem={renderItem}
            keyExtractor={(item) => item.post_comment_id}
            inverted
          />
        </View>
      </View>

      <View style={globalStyles.bottomView}>
        <Formik
          initialValues={{ mycomment: "" }}
          // validationSchema={addMessageSchema}
          // add validation to make sure character limits are not exceeded for both entries
          // add validation to make sure the message isn't null
          onSubmit={(values, actions) => {
            const vals = { ...values };
            console.log({ ...user, ...vals });
            const uservals = { ...user, ...values };
            console.log("user submitted this comment: " + vals.mycomment);
            actions.resetForm();
            socket.emit("insert comment return updated list", uservals);
            // router.post("/:group_id/posts/:post_id/createcomment", handleCreateComment);
          }}
        >
          {(props) => (
            <View>
              <Text>{error}</Text>
              <Text style={{ textAlign: "center" }}>
                <ErrorMessage name="mycomment" />
              </Text>
              <View style={globalStyles.buttonContainer}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Add comment..."
                  onChangeText={props.handleChange("mycomment")}
                  value={props.values.mycomment}
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
