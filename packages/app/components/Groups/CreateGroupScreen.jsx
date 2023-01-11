import * as React from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import { globalStyles } from "../../styles/global";
import { AccountContext } from "../AccountContext";
import * as SecureStore from "expo-secure-store";

export default function CreateGroupScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  const [option, setOption] = React.useState(null);
  const [privacySelection, setPrivacySelection] = React.useState("Private");

  const [userOption, setUserOption] = React.useState(null);
  const selectHandler = (value) => {
    onSelect(value);
    setUserOption(value);
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.backButton}>
        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={globalStyles.secondaryButtonText}>{"< "} Home</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.innerContainer}>
        <Formik
          initialValues={{
            groupname: "",
            description: "",
            visibility: "Private",
          }}
          // add validation to make sure character limits are not exceeded for both entries
          onSubmit={(values, actions) => {
            const vals = { ...values };
            const allvals = { ...values, privacySelection };
            actions.resetForm();
            fetch("http://localhost:4000/groups/creategroup", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              //body: JSON.stringify({ ...user, ...vals }),
              body: JSON.stringify({ ...user, ...allvals }),
            })
              .catch((err) => {
                return;
              })
              .then((res) => {
                if (!res || !res.ok || res.status >= 400) {
                  return;
                }
                return res.json();
              })
              .then((data) => {
                if (!data) return;
                console.log(data);
                setUser({ ...data });
                if (data.status) {
                  setError(data.status);
                } else if (data.loggedIn) {
                  SecureStore.setItemAsync("token", data.token);
                }
              });
          }}
        >
          {(props) => (
            <View>
              <Text style={globalStyles.headerText}>Create group</Text>
              <View style={{ marginVertical: 5 }}></View>
              <View style={{ marginHorizontal: 30 }}>
                <Text>{error}</Text>
                <Text>Group Name</Text>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Enter group name"
                  onChangeText={props.handleChange("groupname")}
                  value={props.values.groupname}
                  marginBottom={10}
                />
                {/* <Text>
              <ErrorMessage name="groupname" />
            </Text> */}
                <Text>Description</Text>
                <TextInput
                  // make the text box larger? Make sure it's maximum 255 characters.
                  style={globalStyles.inputLarge}
                  multiline={true}
                  placeholder="Enter description"
                  onChangeText={props.handleChange("description")}
                  value={props.values.description}
                  marginBottom={10}
                />
                {/* <Text>
              <ErrorMessage name="description" />
            </Text> */}
                <Text>Visibility</Text>
                <View style={{ marginVertical: 5 }}></View>
                <View style={globalStyles.buttonContainer}>
                  <View>
                    <TouchableOpacity
                      //style={globalStyles.secondaryButton}
                      style={
                        privacySelection === "Private"
                          ? globalStyles.selected
                          : globalStyles.unselected
                      }
                      onPress={() => {
                        //Alert.alert("you selected Private");
                        setPrivacySelection("Private");
                        //console.log(privacySelection);
                      }}
                    >
                      <Text style={globalStyles.secondaryButtonText}>
                        Private
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      //style={globalStyles.primaryButton}
                      style={
                        privacySelection === "Public"
                          ? globalStyles.selected
                          : globalStyles.unselected
                      }
                      //onPress={() => Alert.alert("you selected Public")}
                      onPress={() => {
                        // Alert.alert("you selected Public");
                        setPrivacySelection("Public");
                        //console.log(privacySelection);
                      }}
                    >
                      <Text style={globalStyles.secondaryButtonText}>
                        Public
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginVertical: 10 }}></View>
                <TouchableOpacity
                  style={globalStyles.primaryButton}
                  onPress={props.handleSubmit}
                >
                  <Text style={globalStyles.primaryButtonText}>
                    Create Group
                  </Text>
                </TouchableOpacity>
                {/* <Button title="Create Group" onPress={props.handleSubmit} /> */}
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
