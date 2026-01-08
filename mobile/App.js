import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { MyColorContext } from "./utils/contexts/MyColorContext";

import MyReducers from "./utils/reducers/MyReducers";
import { MyUserContext } from "./utils/contexts/MyContext";
import { ActivityIndicator, Icon } from "react-native-paper";

import { useEffect, useReducer, useState } from "react";
import axiosClient from "./api/axiosClient";
import { endpoints } from "./utils/Apis";

import {
  initialThemeState,
  ThemeReducer,
} from "./utils/reducers/ThemeReducers";
import TabNavigator from "./navigation/TabNavigation";
import { CoursesProvider } from "./utils/contexts/CoursesContext";
import { CategoriesProvider } from "./utils/contexts/CategoriesContext";

export default function App() {
  const [user, dispatch] = useReducer(MyReducers, null);
  const [theme, themeDispatch] = useReducer(ThemeReducer, initialThemeState);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const hydrateAuth = async () => {
      let token;
      setLoading(true);
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
          <CoursesProvider>
            <CategoriesProvider>
              <TabNavigator />
            </CategoriesProvider>
          </CoursesProvider>
        </NavigationContainer>
      </MyUserContext.Provider>
    </MyColorContext.Provider>
  );
}
