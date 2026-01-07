import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/User/Login";
import Register from "../screens/User/Register";
import Appearance from "../screens/Setting/Appearance";
import AccountScreen from "../screens/Account/Account";
import AccountDetailedScreen from "../screens/Account/AccountDetailed";
import TermsScreen from "../screens/Account/Terms";
import HelpAndFeedbackScreen from "../screens/Account/HelpAndFeedback";
import InstructorStack from "./InstructorStack";

const Stack = createNativeStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen
        name="AccountDetailedScreen"
        component={AccountDetailedScreen}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Appearance" component={Appearance} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="InstructorStack" component={InstructorStack} />
      <Stack.Screen name="Help" component={HelpAndFeedbackScreen} />
    </Stack.Navigator>
  );
};

export default AccountStack;
