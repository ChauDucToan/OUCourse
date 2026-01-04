import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "../screens/Search/Search";
const Stack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchScreen" component={Search} />
    </Stack.Navigator>
  );
};

export default SearchStack;
