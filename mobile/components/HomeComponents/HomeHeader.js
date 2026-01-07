import { useContext } from "react";
import { Text, View } from "react-native";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

export const HomeHeader = ({ text = "", subText = "" }) => {
  const { theme } = useContext(MyColorContext);
  return (
    <View className="p-5">
      <Text className="text-2xl font-bold mt-12">{text}</Text>
      <Text
        className="text-base mb-4"
        style={{
          color: theme.colors.gray[500],
        }}
      >
        {subText}
      </Text>
    </View>
  );
};
