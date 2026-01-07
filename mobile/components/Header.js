import { View } from "react-native";
import HeaderBack from "./HeaderBack";
import TextCustom from "./TextCustom";

const HeaderCustom = ({ text, viewClass = "" }) => {
  return (
    <View className="flex-row items-center ">
      <View className={`w-16 ${viewClass}`}>
        <HeaderBack />
      </View>
      <View className="items-center py-1">
        <TextCustom.TextSection text={text} />
      </View>
      <View className={`w-16 ${viewClass}`}></View>
    </View>
  );
};
export default HeaderCustom;
