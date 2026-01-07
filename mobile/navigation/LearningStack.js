import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserLearning from "../screens/User/UserLearning";
import { LessonScreen } from "../screens/Lesson/Lesson";
const Stack = createNativeStackNavigator();

const LearningStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserLearning" component={UserLearning} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
    </Stack.Navigator>
  );
};

export default LearningStack;
