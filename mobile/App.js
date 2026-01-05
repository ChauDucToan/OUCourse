import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { useReducer } from "react";
import MyReducers from "./utils/reducers/MyReducers";
import { MyUserContext } from "./utils/contexts/MyContext";
import { ActivityIndicator, Icon } from "react-native-paper";

import { useContext } from "react";
import colors from "tailwindcss/colors";

import AccountStack from "./navigation/AccountStack";
import HomeStack from "./navigation/HomeStack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchStack from "./navigation/SearchStack";
import { useEffect } from "react";
import axiosClient from "./api/axiosClient";
import { endpoints } from "./utils/Apis";
import { useState } from "react";
import { View } from "react-native";
import LearningStack from "./navigation/LearningStack";
import * as Linking from "expo-linking";
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [user] = useContext(MyUserContext);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // ẩn header của tab
      }}
    >
      <Tab.Screen
        name={"Home"}
        component={HomeStack}
        screenO
        options={{
          tabBarIcon: () => (
            <Icon color={colors.slate[500]} source="home" size={30} />
          ),
          tabBarActiveTintColor: colors.gray[900],
          tabBarInactiveTintColor: colors.gray[400],
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          title: "Tìm kiếm",
          tabBarIcon: () => (
            <Icon color={colors.slate[500]} source="magnify" size={30} />
          ),
          tabBarActiveTintColor: colors.gray[900],
          tabBarInactiveTintColor: colors.gray[400],
        }}
      />
      <Tab.Screen
        name="Learning"
        component={LearningStack}
        options={{
          title: "Học nào",
          tabBarIcon: () => (
            <Icon
              color={colors.slate[500]}
              source="play-circle-outline"
              size={30}
            />
          ),
          tabBarActiveTintColor: colors.gray[900],
          tabBarInactiveTintColor: colors.gray[400],
        }}
      />
      <Tab.Screen
        name={"Account"}
        component={AccountStack}
        options={{
          title: "Tài khoản",
          tabBarIcon: () => (
            <Icon color={colors.slate[500]} source="account" size={30} />
          ),
          tabBarActiveTintColor: colors.gray[900],
          tabBarInactiveTintColor: colors.gray[400],
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [user, dispatch] = useReducer(MyReducers, null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const hydrateAuth = async () => {
      let token;
      try {
        const res = await axiosClient.get(endpoints.current_user);
        dispatch({
          type: "login",
          payload: res.data,
        });
      } catch (error) {
        console.error("Use effect App", error);
      } finally {
        setLoading(false);
      }
    };

    hydrateAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.blue[600]} />
      </View>
    );
  }

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </MyUserContext.Provider>
  );
}
