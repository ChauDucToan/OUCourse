import { View } from "react-native";
import HeaderCustom from "../Header";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

const InstructorCourses = () => {
  const { theme } = useContext(MyColorContext);

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
