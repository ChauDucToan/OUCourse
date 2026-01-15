import { View } from "react-native";
import HeaderCustom from "../Header";
import { useColors } from "../../hooks/useColors";

const InstructorCourses = () => {
  const { theme } = useColors();

  return (
    <View
      className="pt-10 "
      style={{
        backgroundColor: theme.colors.white,
      }}
    >
      <HeaderCustom text={"Trang quản lý khóa học"} />
    </View>
  );
};
export default InstructorCourses;
