import { View } from "react-native";
import HeaderCustom from "../../components/Header";
import { useColors } from "../../hooks/useColors";

const InstructorTrackStudent = () => {
  const { theme } = useColors();

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
