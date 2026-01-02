import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home/Home";
import { useReducer } from "react";
import MyReducers from "./utils/reducers/MyReducers";
import { MyUserContext } from "./utils/contexts/MyContext";
import { Card, Icon } from "react-native-paper";
import { useContext } from "react";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
import Register from "./screens/User/Register";
import Login from "./screens/User/Login";
import User from "./screens/User/User";
const StackNavigator = () => {
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

const TabNavigator = () => {
  const [user] = useContext(MyUserContext);
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={"Home"}
        component={StackNavigator}
        options={{
          title: "Trang chủ",
          tabBarIcon: () => <Icon color="blue" source="home" size={30} />,
        }}
      />
      {user === null ? (
        <>
          <Tab.Screen
            name="Register"
            component={Register}
            options={{
              title: "Đăng ký",
              tabBarIcon: () => (
                <Icon color="blue" source="account" size={30} />
              ),
            }}
          />
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              title: "Đăng nhập",
              tabBarIcon: () => <Icon color="blue" source="login" size={30} />,
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Profile"
            component={User}
            options={{
              title: "Profile",
              tabBarIcon: () => (
                <Icon color="blue" source="account" size={30} />
              ),
            }}
          />
        </>
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
