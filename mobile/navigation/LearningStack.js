import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserLearning from "../screens/User/UserLearning";

const Stack = createNativeStackNavigator();

const LearningStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserLearning" component={UserLearning} />
    </Stack.Navigator>
  );
};

export default LearningStack;
