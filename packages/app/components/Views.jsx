import "react-native-gesture-handler";
import * as React from "react";
import { View, Text, Button, Stylesheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext } from "react";
import { AccountContext } from "./AccountContext";

import LoginScreen from "./Login/LoginScreen";
import SignUpScreen from "./Login/SignUpScreen";
import HomeScreen from "./HomeScreen";
import DetailScreen from "./DetailScreen";
import SettingsScreen from "./UserSettings/SettingsScreen";
import DeleteAccountScreen from "./UserSettings/DeleteAccount";
import ChangeUsernameScreen from "./UserSettings/ChangeUsername";
import ChangePasswordScreen from "./UserSettings/ChangePassword";
import SplashScreen from "./SplashScreen";

const useAuth = () => {
  const { user } = useContext(AccountContext);
  return user && user.loggedIn;
};

const StackHome = createNativeStackNavigator();

function HomeStack() {
  return (
    <StackHome.Navigator initialRouteName="Home">
      <StackHome.Screen name="Home" component={HomeScreen} />
      <StackHome.Screen name="Detail" component={DetailScreen} />
      <StackHome.Screen name="DeleteScreen" component={DeleteAccountScreen} />
      <StackHome.Screen
        name="ChangeUsernameScreen"
        component={ChangeUsernameScreen}
      />
      <StackHome.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
    </StackHome.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function HomeTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const StackAuth = createNativeStackNavigator();

function AuthStack() {
  return (
    <StackAuth.Navigator initialRouteName="Login">
      <StackAuth.Screen name="Login" component={LoginScreen} />
      <StackAuth.Screen name="SignUp" component={SignUpScreen} />
    </StackAuth.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function Views() {
  const { user } = useContext(AccountContext);
  const isAuth = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {
        // state.isLoading ? (
        //   // We haven't finished checking for the token yet
        //   <Stack.Screen name="Splash" component={SplashScreen} />
        // ) :
        user.loggedIn == false ? (
          // user isn't logged in
          <Stack.Screen
            name="Sign in"
            component={AuthStack}
            options={{
              title: "Log in",
              // When logging out, a pop animation feels intuitive
              // animationTypeForReplace: state.isSignout ? "pop" : "push",
            }}
          />
        ) : (
          // User is logged in
          <Stack.Screen name="HomeTabs" component={HomeTab} />
        )
      }
    </Stack.Navigator>
  );
}
