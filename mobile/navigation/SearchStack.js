import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "../screens/Search/Search";
<<<<<<< HEAD
import CourseDetailedScreen from "../screens/Course/Course";
=======
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
const Stack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchScreen" component={Search} />
<<<<<<< HEAD
      <Stack.Screen
        name="CourseDetailedScreen"
        component={CourseDetailedScreen}
      />
=======
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
    </Stack.Navigator>
  );
};

export default SearchStack;
