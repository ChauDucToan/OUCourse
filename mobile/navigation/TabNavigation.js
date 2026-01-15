import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountStack from "./AccountStack";
import HomeStack from "./HomeStack";
import LearningStack from "./LearningStack";
import SearchStack from "./SearchStack";

import { Icon } from "react-native-paper";
import { useColors } from "../hooks/useColors";

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const { theme } = useColors();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
export default TabNavigator;
