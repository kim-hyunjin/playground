import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../screens/Welcome";
import SignInContainer from "../screens/Auth//SignIn/index";
import SignUpContainer from "../screens/Auth/SignUp/index";
import BackBtn from "../components/Auth/BackBtn";

const Auth = createStackNavigator();

export default () => (
  <Auth.Navigator
    mode="modal"
    screenOptions={{
      headerBackTitleVisible: false,
      headerTransparent: true,
      headerBackImage: () => <BackBtn />,
    }}
  >
    <Auth.Screen
      name="Welcome"
      component={Welcome}
      options={{
        headerTitleStyle: {
          color: "white",
        },
      }}
    />
    <Auth.Screen
      name="SignIn"
      component={SignInContainer}
      options={{ title: "Sign In" }}
    />
    <Auth.Screen
      name="SignUp"
      component={SignUpContainer}
      options={{ title: "Sign Up" }}
    />
  </Auth.Navigator>
);
