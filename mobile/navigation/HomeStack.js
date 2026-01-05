import { createNativeStackNavigator } from "@react-navigation/native-stack";
<<<<<<< HEAD
import HomeScreen from "../screens/Home/Home";
=======
import Home from "../screens/Home/Home";
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
<<<<<<< HEAD
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
=======
      <Stack.Screen name="Home" component={Home} />
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
    </Stack.Navigator>
  );
};

export default HomeStack;
