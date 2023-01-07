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
//import { RadioButton } from "react-native-paper";
import RadioButton from "./RadioButton";

export default function CreateGroupScreen({ navigation }) {
  const { user, setUser } = React.useContext(AccountContext);
  const [error, setError] = React.useState(null);

  const [option, setOption] = React.useState(null);

  const data = [
    { value: "Apple" },
    { value: "Samsung" },
    { value: "Blackberry" },
  ];

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

      <View>
        <Text>Welcome to the create group</Text>
        <Formik
          initialValues={{
            groupname: "",
            description: "",
            visibility: "Private",
          }}
          // add validation to make sure character limits are not exceeded for both entries
          onSubmit={(values, actions) => {
            const vals = { ...values };
            actions.resetForm();
            fetch("http://localhost:4000/groups/creategroup", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...user, ...vals }),
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
                style={globalStyles.input}
                placeholder="Enter description"
                onChangeText={props.handleChange("description")}
                value={props.values.description}
                marginBottom={10}
              />
              {/* <Text>
              <ErrorMessage name="description" />
            </Text> */}
              <Text>Visibility</Text>
              {/* 
              <View style={globalStyles.buttonContainer}>
                <View>
                  <TouchableOpacity
                    style={globalStyles.secondaryButton}
                    //  onPress={() => navigation.navigate("SignUp")}
                  >
                    <Text style={globalStyles.secondaryButtonText}>
                      Private
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={globalStyles.secondaryButton}
                    // onPress={props.handleSubmit}
                  >
                    <Text style={globalStyles.secondaryButtonText}>Public</Text>
                  </TouchableOpacity>
                </View>
              </View> */}

              {/* <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                onPress={() => console.log("Pressed")}
              >
                <View>
                  <Text>Press Me</Text>
                </View>
              </Pressable>

              <View>
                <RadioButton.Group
                  onValueChange={props.handleChange("visibility")}
                  value={props.values.visibility}
                  disabled="false"
                >
                  <View>
                    <Text>Private</Text>
                    <RadioButton value="Private"></RadioButton>
                  </View>
                  <View>
                    <Text>Public</Text>
                    <RadioButton value="Public"></RadioButton>
                  </View>
                </RadioButton.Group>
              </View> */}

              <Text style={globalStyles.paragraph}>
                Choose your favorite company:{" "}
              </Text>
              <RadioButton data={data} onSelect={(value) => setOption(value)} />
              <Text> Your option: {option}</Text>

              <Button title="Create Group" onPress={props.handleSubmit} />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}
