import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";

const HeaderBack = () => {
  const nav = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => nav.goBack()}
      className=" p-2 rounded-full mr-3"
    >
      <Icon source="arrow-left" size={24} color="#374151" />
    </TouchableOpacity>
  );
};
export default HeaderBack;
