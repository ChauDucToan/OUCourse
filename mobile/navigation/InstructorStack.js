import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InstructorDashboard from "../screens/Instructor/InstructorDashboard";
import InstructorCourses from "../screens/Instructor/InstructorCourses";
import CourseEditor from "../screens/Instructor/CourseEditor";
import InstructorTrackStudent from "../screens/Instructor/InstructorTrackStudent";
import MangeCourseDetailed from "../screens/Instructor/ManageCourseDetaield";
import EditMyCourse from "../screens/Instructor/EditMyCourse";
import CreateLesson from "../screens/Lesson/CreateLesson";

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
      <Stack.Screen name="EditMyCourse" component={EditMyCourse} />
      <Stack.Screen
        name="InstructorTrackStudent"
        component={InstructorTrackStudent}
      />
      <Stack.Screen
        name="MangeCourseDetailed"
        component={MangeCourseDetailed}
      />
      <Stack.Screen name="CreateLesson" component={CreateLesson} />
    </Stack.Navigator>
  );
};

export default InstructorStack;
