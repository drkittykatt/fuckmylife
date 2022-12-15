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
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";
import socket from "../../socket";

export default function ViewPostScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);
  //const [chats, setChats] = React.useState([]);

  const groupTitleButton = user.groupName;

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
          <Text>comments: </Text>
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
            console.log("user submitted this message: " + vals.mycomment);
          }}
        >
          {(props) => (
            <View>
              <Text>{error}</Text>
              <Text style={{ textAlign: "center" }}>
                <ErrorMessage name="mypost" />
              </Text>
              <View style={globalStyles.buttonContainer}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Send message..."
                  onChangeText={props.handleChange("mypost")}
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
