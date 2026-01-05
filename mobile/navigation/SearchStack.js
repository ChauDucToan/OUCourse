import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "../screens/Search/Search";
import CourseDetailedScreen from "../screens/Course/Course";

const Stack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchScreen" component={Search} />
      <Stack.Screen
        name="CourseDetailedScreen"
        component={CourseDetailedScreen}
      />
    </Stack.Navigator>
  );
};

export default SearchStack;
