import { View } from "react-native";
import HeaderCustom from "../Header";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { useContext } from "react";

const CourseEditor = () => {
  const { theme } = useContext(MyColorContext);

  return (
    <View
      className="pt-10 "
      style={{
        backgroundColor: theme.colors.white,
      }}
    >
      <HeaderCustom text={"Tạo mới khóa học"} />
    </View>
  );
};
export default CourseEditor;
