import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserLearning from "../screens/User/UserLearning";
import { LessonScreen } from "../screens/Lesson/Lesson";
import LessonLearning from "../screens/Lesson/LessonLearning";
const Stack = createNativeStackNavigator();

const LearningStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserLearning" component={UserLearning} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="LessonLearning" component={LessonLearning} />
    </Stack.Navigator>
  );
};

export default LearningStack;
