import { useContext } from "react";
import { Text } from "react-native";
import { View } from "react-native";
import { MyColorContext } from "../utils/contexts/MyColorContext";

export const Section = ({ title, content }) => {
  const { theme } = useContext(MyColorContext);

  return (
    <View className="mb-6">
      <Text
        className="text-gray-900 font-bold text-lg mb-2"
        style={{
          color: theme.colors.gray[900],
        }}
      >
        {title}
      </Text>
      <Text
        className="text-gray-600 text-base leading-6 text-justify"
        style={{
          color: theme.colors.gray[600],
        }}
      >
        {content}
      </Text>
    </View>
  );
};
