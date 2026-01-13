import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { View } from "react-native";
import "./global.css";
import MyReducers from "./utils/reducers/MyReducers";
import { ActivityIndicator } from "react-native-paper";

import { useEffect, useReducer, useState } from "react";
import axiosClient from "./api/axiosClient";
import { endpoints } from "./utils/Apis";

import {
  initialThemeState,
  ThemeReducer,
} from "./utils/reducers/ThemeReducers";
import TabNavigator from "./navigation/TabNavigation";
import { getTokens } from "./utils/tokenUtils";
import AppProvider from "./utils/AppProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [user, dispatch] = useReducer(MyReducers, null);
  const [theme, themeDispatch] = useReducer(ThemeReducer, initialThemeState);
  const [loading, setLoading] = useState(true);
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.gray[100], // Sử dụng màu tối từ theme của bạn
    },
  };
  useEffect(() => {
    const cacheUser = async () => {
      const tokens = await getTokens();
      if (!tokens) {
        setLoading(false);
        return;
      }
      try {
        const res = await axiosClient.get(endpoints.current_user);
        dispatch({
          type: "login",
          payload: res?.data,
        });
      } catch (error) {
        console.error("Use effect App", error);
      } finally {
        setLoading(false);
      }
    };
    cacheUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider state={{ theme, themeDispatch, user, dispatch }}>
        <NavigationContainer theme={navigationTheme}>
          <TabNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
