import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Views from "./components/Views";
import { NavigationContainer } from "@react-navigation/native";
import UserContext from "./components/AccountContext";

export default function App() {
  return (
    <UserContext>
      <NavigationContainer>
        <Views />
      </NavigationContainer>
    </UserContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
