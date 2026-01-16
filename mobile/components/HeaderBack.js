import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";

const HeaderBack = ({ theme, targetScreen }) => {
  const nav = useNavigation();
  const handleGoBack = () => {
    if (targetScreen) {
      nav.navigate(targetScreen);
    } else {
      nav.goBack();
    }
  };
  return (
    <TouchableOpacity onPress={handleGoBack} className=" p-2 rounded-full mr-5">
      <Icon source="arrow-left" size={24} color={theme.colors.gray[400]} />
    </TouchableOpacity>
  );
};
export default HeaderBack;
