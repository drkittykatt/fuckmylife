import * as React from "react";
import {
  Button,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../styles/global";

export default function SplashScreen({ navigation }) {
  return (
    <SafeAreaView style={globalStyles.container}>
      <Image
        style={{ width: 200, height: 200 }}
        source={require("../assets/nuubiTransparent.png")}
      />
      <View style={{ marginVertical: 20 }}></View>
      <Text style={globalStyles.titleText}>
        <Text>Welcome to Nuubi,</Text>
        <Text style={{ fontWeight: "normal" }}>
          {" "}
          the chat platform for learning.
        </Text>
      </Text>
      <View style={{ marginVertical: 20 }}></View>
      <View style={globalStyles.buttonContainer}>
        <View>
          <TouchableOpacity
            style={globalStyles.secondaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={globalStyles.secondaryButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={globalStyles.primaryButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
