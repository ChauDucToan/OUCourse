import { View } from "react-native";
import HeaderBack from "./HeaderBack";
import { Text } from "react-native";

const HeaderCustom = ({ text }) => {
  return (
    <View className="flex-row items-center ">
      <View className="w-16">
        <HeaderBack />
      </View>
      <View className="flex-1 items-center  py-1">
        <Text className="text-xl font-bold text-slate-700">{text}</Text>
      </View>
      <View className="w-16"></View>
    </View>
  );
};
export default HeaderCustom;
