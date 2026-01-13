import { Text } from "react-native";
import { View } from "react-native";

export const Section = ({ title, content, theme }) => {
  return (
    <View className="mb-6">
      <Text
        className=" font-bold text-lg mb-2"
        style={{
          color: theme.colors.slate[400],
        }}
      >
        {title}
      </Text>
      <Text
        className=" text-base leading-6 text-justify"
        style={{
          color: theme.colors.gray[400],
        }}
      >
        {content}
      </Text>
    </View>
  );
};
