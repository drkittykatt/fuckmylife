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
import ForgotPasswordScreen from "./UserSettings/ForgotPassword";
import ForgotPasswordLoggedOut from "./UserSettings/ForgotPasswordLoggedOut";

import GeneralGroupScreen from "./Groups/GeneralGroupScreen";
import CreateGroupScreen from "./Groups/CreateGroupScreen";
import JoinGroupScreen from "./Groups/JoinGroupScreen";
import GroupListScreen from "./Groups/GroupListScreen";
import MyGroupsScreen from "./Groups/MyGroupsScreen";
import ChatScreen from "./Chat/ChatScreen";

import SplashScreen from "./SplashScreen";

const useAuth = () => {
  const { user } = useContext(AccountContext);
  return user && user.loggedIn;
};

const StackHome = createNativeStackNavigator();

function HomeStack() {
  return (
    <StackHome.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <StackHome.Screen name="Home" component={HomeScreen} />
      <StackHome.Screen name="Detail" component={DetailScreen} />
      <StackHome.Screen name="DeleteScreen" component={DeleteAccountScreen} />
      <StackHome.Screen
        name="ForgotPasswordLoggedIn"
        component={ForgotPasswordScreen}
      />
      <StackHome.Screen
        name="ChangeUsernameScreen"
        component={ChangeUsernameScreen}
      />
      <StackHome.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <StackHome.Screen
        name="GeneralGroupScreen"
        component={GeneralGroupScreen}
      />
      <StackHome.Screen name="CreateGroup" component={CreateGroupScreen} />
      <StackHome.Screen name="JoinGroup" component={JoinGroupScreen} />
      <StackHome.Screen name="ViewAllGroups" component={GroupListScreen} />
      <StackHome.Screen name="ViewMyGroups" component={MyGroupsScreen} />
      <StackHome.Screen name="ChatScreen" component={ChatScreen} />

      <StackHome.Screen name="Settings" component={SettingsScreen} />
      <StackHome.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <StackHome.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <StackHome.Screen
        name="ChangeUsername"
        component={ChangeUsernameScreen}
      />
      <StackHome.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
    </StackHome.Navigator>
  );
}

const StackGroup = createNativeStackNavigator();

function GroupStack() {
  return (
    <StackGroup.Navigator initialRouteName="GeneralGroupScreen">
      <StackGroup.Screen
        name="GeneralGroupScreen"
        component={GeneralGroupScreen}
      />
      <StackGroup.Screen name="CreateGroup" component={CreateGroupScreen} />
      <StackGroup.Screen name="JoinGroup" component={JoinGroupScreen} />
      <StackGroup.Screen name="ViewAllGroups" component={GroupListScreen} />
      <StackGroup.Screen name="ViewMyGroups" component={MyGroupsScreen} />
      <StackGroup.Screen name="ChatScreen" component={ChatScreen} />
    </StackGroup.Navigator>
  );
}

// const Tab = createBottomTabNavigator();

// function HomeTab() {
//   return (
//     <Tab.Navigator screenOptions={{ headerShown: false }}>
//       <Tab.Screen name="HomeStack" component={HomeStack} />
//       <Tab.Screen name="GroupStack" component={GroupStack} />
//     </Tab.Navigator>
//   );
// }

const StackAuth = createNativeStackNavigator();

function AuthStack() {
  return (
    <StackAuth.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <StackAuth.Screen name="Splash" component={SplashScreen} />
      <StackAuth.Screen name="Login" component={LoginScreen} />
      <StackAuth.Screen name="SignUp" component={SignUpScreen} />
      <StackAuth.Screen
        name="ForgotPasswordLoggedOut"
        component={ForgotPasswordLoggedOut}
      />
    </StackAuth.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function Views() {
  const { user } = useContext(AccountContext);
  const isAuth = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user.loggedIn == false ? (
        <Stack.Screen
          name="Sign in"
          component={AuthStack}
          options={{
            title: "Log in",
          }}
        />
      ) : (
        <Stack.Screen name="HomeStack" component={HomeStack} />
      )}
    </Stack.Navigator>
  );
}
