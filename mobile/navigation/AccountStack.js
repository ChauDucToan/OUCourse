import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/User/Login";
import Register from "../screens/User/Register";
import Appearance from "../screens/Setting/Appearance";
import AccountScreen from "../screens/Account/Account";

const Stack = createNativeStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Appearance" component={Appearance} />
    </Stack.Navigator>
  );
};

export default AccountStack;
