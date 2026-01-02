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

import Appearance from "./screens/Setting/Appearance";
import Setting from "./screens/Setting/Setting";
import AccountScreen from "./screens/Account/Account";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";

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
const StackAccountNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AccountScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
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
          tabBarActiveTintColor: colors.gray[900],
          tabBarInactiveTintColor: colors.gray[400],
        }}
      />
      <Tab.Screen
        name="Search"
        component={StackHomeNavigator}
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
        component={StackHomeNavigator}
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
        component={StackAccountNavigator}
        options={{
          title: "Tài khoản",
          tabBarIcon: () => (
            <Icon color={colors.slate[500]} source="account" size={30} />
          ),
          tabBarActiveTintColor: colors.gray[900],
          tabBarInactiveTintColor: colors.gray[400],
        }}
      />
      {user && (
        <Tab.Screen
          name="Profile"
          component={AccountScreen}
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
