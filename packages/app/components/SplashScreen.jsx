import * as React from "react";
import { Button, View, Text, SafeAreaView, Image } from "react-native";
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
      <View style={globalStyles.fixToText}>
        <View style={globalStyles.secondaryButton}>
          <Button title="Log in" onPress={() => navigation.navigate("Login")} />
        </View>
        <View style={{ marginHorizontal: 15 }}></View>
        <View style={globalStyles.primaryButton}>
          <Button
            title="Sign up"
            color="#fdfdfd"
            onPress={() => navigation.navigate("SignUp")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
