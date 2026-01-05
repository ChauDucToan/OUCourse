import { createNativeStackNavigator } from "@react-navigation/native-stack";
<<<<<<< HEAD
import Login from "../screens/User/Login";
import Register from "../screens/User/Register";
import Appearance from "../screens/Setting/Appearance";
import AccountScreen from "../screens/Account/Account";
import AccountDetailedScreen from "../screens/Account/AccountDetailed";
=======
import Account from "../screens/Account/Account";
import Login from "../screens/User/Login";
import Register from "../screens/User/Register";
import Appearance from "../screens/Setting/Appearance";
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3

const Stack = createNativeStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
<<<<<<< HEAD
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen
        name="AccountDetailedScreen"
        component={AccountDetailedScreen}
      />
=======
      <Stack.Screen name="Account" component={Account} />
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Appearance" component={Appearance} />
    </Stack.Navigator>
  );
};

export default AccountStack;
