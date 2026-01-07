import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InstructorDashboard from "../components/InstructorComponents/InstructorDashboard";
import InstructorCourses from "../components/InstructorComponents/InstructorCourses";
import CourseEditor from "../components/InstructorComponents/CourseEditor";
import InstructorTrackStudent from "../components/InstructorComponents/InstructorTrackStudent";

const Stack = createNativeStackNavigator();

const InstructorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="InstructorDashboard"
        component={InstructorDashboard}
      />
      <Stack.Screen name="InstructorCourses" component={InstructorCourses} />
      <Stack.Screen name="CourseEditor" component={CourseEditor} />

      <Stack.Screen
        name="InstructorTrackStudent"
        component={InstructorTrackStudent}
      />
    </Stack.Navigator>
  );
};

export default InstructorStack;
