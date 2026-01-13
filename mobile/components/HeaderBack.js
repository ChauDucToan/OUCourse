import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";

const HeaderBack = ({ theme }) => {
  const nav = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => nav.goBack()}
      className=" p-2 rounded-full mr-5"
    >
      <Icon source="arrow-left" size={24} color={theme.colors.gray[400]} />
    </TouchableOpacity>
  );
};
export default HeaderBack;
