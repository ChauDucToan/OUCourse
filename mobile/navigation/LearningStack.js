import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserLearning from "../screens/User/UserLearning";
import { LessonScreen } from "../screens/Lesson/Lesson";
import LessonLearning from "../screens/Lesson/LessonLearning";
import { LessonProvider } from "../utils/contexts/LessonContext";
import CourseCompletedLearning from "../screens/Course/CourseCompletedLearning";
const Stack = createNativeStackNavigator();

const LearningStack = () => {
  return (
    <LessonProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserLearning" component={UserLearning} />
        <Stack.Screen
          name="CourseCompletedLearning"
          component={CourseCompletedLearning}
        />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        <Stack.Screen name="LessonLearning" component={LessonLearning} />
      </Stack.Navigator>
    </LessonProvider>
  );
};

export default LearningStack;
