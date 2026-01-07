import { Text, View } from "react-native";

export const HomeHeader = ({ text = "", subText = "" }) => {
  return (
    <View className="p-5">
      <Text className="text-2xl font-bold mt-12">{text}</Text>
      <Text className="text-base text-gray-500 mb-4">{subText}</Text>
    </View>
  );
};
