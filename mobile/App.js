import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home/Home";
import { useReducer } from "react";
import MyReducers from "./utils/reducers/MyReducers";
import { MyUserContext } from "./utils/contexts/MyContext";
import { Card, Icon } from "react-native-paper";
import { useContext } from "react";
import colors from "tailwindcss/colors";

import Auth from "./screens/User/Auth";
import User from "./screens/User/User";
import Appearance from "./screens/Setting/Appearance";
import Setting from "./screens/Setting/Setting";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StackHomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={"Course"}
        component={Home}
        options={{ title: "Trang chủ" }}
      />
      <Stack.Screen
        name="MyLearning"
        component={Card}
        options={{ title: "card ne" }}
      />
    </Stack.Navigator>
  );
};
const StackSettingNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Setting"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{ title: "Cài đặt" }}
      />
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Apperance" component={Appearance} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const [user] = useContext(MyUserContext);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={"Home"}
        component={StackHomeNavigator}
        options={{
          title: "Trang chủ",
          tabBarIcon: () => (
            <Icon color={colors.slate[500]} source="home" size={30} />
          ),
          tabBarActiveTintColor: colors.gray[500],
        }}
      />
      <Tab.Screen
        name={"Setting"}
        component={StackSettingNavigator}
        options={{
          title: "Cài đặt",
          tabBarIcon: () => (
            <Icon color={colors.slate[500]} source="cog-outline" size={30} />
          ),
          tabBarActiveTintColor: colors.gray[500],
        }}
      />
      {user && (
        <Tab.Screen
          name="Profile"
          component={User}
          options={{
            title: "Profile",
            tabBarIcon: () => (
              <Icon color={colors.slate[500]} source="account" size={30} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default function App() {
  const [user, dispatch] = useReducer(MyReducers, null);
  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </MyUserContext.Provider>
  );
}
