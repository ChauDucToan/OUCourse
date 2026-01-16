import { View } from "react-native";
import { useColors } from "../../hooks/useColors";
import HeaderCustom from "../../components/Header";

const CourseCompletedLearning = () => {
  const { theme } = useColors();
  return (
    <View className="pt-10" style={{ backgroundColor: theme.colors.gray[100] }}>
      <HeaderCustom text="Danh sách các khóa học đã hoàn thành" />
    </View>
  );
};
export default CourseCompletedLearning;
