import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import LearningStack from "./navigation/LearningStack";
import { MyColorContext } from "./utils/contexts/MyColorContext";
import SearchStack from "./navigation/SearchStack";
import AccountStack from "./navigation/AccountStack";
import HomeStack from "./navigation/HomeStack";
import MyReducers from "./utils/reducers/MyReducers";
import { MyUserContext } from "./utils/contexts/MyContext";
import { ActivityIndicator, Icon } from "react-native-paper";

import { useContext, useEffect, useReducer, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axiosClient from "./api/axiosClient";
import { endpoints } from "./utils/Apis";

import {
  initialThemeState,
  ThemeReducer,
} from "./utils/reducers/ThemeReducers";

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const [user] = useContext(MyUserContext);
  const { theme } = useContext(MyColorContext);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // ẩn header của tab
        tabBarStyle: {
          backgroundColor: theme.colors.gray[100],
          borderTopColor: theme.colors.slate[200],
        },
      }}
    >
      <Tab.Screen
        name={"Home"}
        component={HomeStack}
        options={{
          tabBarIcon: () => (
            <Icon color={theme.colors.iconDefault} source="home" size={30} />
          ),
          tabBarActiveTintColor: theme.colors.tabActive,
          tabBarInactiveTintColor: theme.colors.tabInactive,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          title: "Tìm kiếm",
          tabBarIcon: () => (
            <Icon color={theme.colors.iconDefault} source="magnify" size={30} />
          ),
          tabBarActiveTintColor: theme.colors.tabActive,
          tabBarInactiveTintColor: theme.colors.tabInactive,
        }}
      />
      <Tab.Screen
        name="Learning"
        component={LearningStack}
        options={{
          title: "Học nào",
          tabBarIcon: () => (
            <Icon
              color={theme.colors.iconDefault}
              source="play-circle-outline"
              size={30}
            />
          ),
          tabBarActiveTintColor: theme.colors.tabActive,
          tabBarInactiveTintColor: theme.colors.tabInactive,
        }}
      />
      <Tab.Screen
        name={"Account"}
        component={AccountStack}
        options={{
          title: "Tài khoản",
          tabBarIcon: () => (
            <Icon color={theme.colors.iconDefault} source="account" size={30} />
          ),
          tabBarActiveTintColor: theme.colors.tabActive,
          tabBarInactiveTintColor: theme.colors.tabInactive,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [user, dispatch] = useReducer(MyReducers, null);
  const [theme, themeDispatch] = useReducer(ThemeReducer, initialThemeState);
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
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <MyColorContext.Provider value={{ theme, themeDispatch }}>
      <MyUserContext.Provider value={[user, dispatch]}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </MyUserContext.Provider>
    </MyColorContext.Provider>
  );
}
