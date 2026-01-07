import { View } from "react-native";
import HeaderCustom from "../Header";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

const InstructorTrackStudent = () => {
  const { theme } = useContext(MyColorContext);

  return (
    <View
      className="pt-10"
      style={{
        backgroundColor: theme.colors.white,
      }}
    >
      <HeaderCustom text={"Trang quản lý học sinh"} />
    </View>
  );
};
export default InstructorTrackStudent;
