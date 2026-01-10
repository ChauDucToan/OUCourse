import { View } from "react-native";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import HeaderCustom from "../../components/Header";

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
