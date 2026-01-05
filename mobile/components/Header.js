import { View } from "react-native";
import HeaderBack from "./HeaderBack";
import TextCustom from "./TextCustom";

const HeaderCustom = ({ text }) => {
  return (
    <View className="flex-row items-center ">
      <View className="w-16">
        <HeaderBack />
      </View>
      <View className="flex-1 items-center  py-1">
        <TextCustom.TextSection text={text} />
      </View>
      <View className="w-16"></View>
    </View>
  );
};
export default HeaderCustom;
