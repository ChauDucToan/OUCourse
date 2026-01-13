import { useContext } from "react";
import { Text, View } from "react-native";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

export const HomeHeader = ({ text = "", subText = "", theme }) => {
  return (
    <View
      className="p-5 "
      style={{
        backgroundColor: theme.colors.gray[100],
      }}
    >
      <Text
        className="text-2xl font-bold mt-12"
        style={{
          color: theme.colors.black,
        }}
      >
        {text}
      </Text>
      <Text
        className="text-base mb-4"
        style={{
          color: theme.colors.black,
        }}
      >
        {subText}
      </Text>
    </View>
  );
};
