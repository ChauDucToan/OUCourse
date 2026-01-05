import { Text } from "react-native";
import { View } from "react-native";

export const Section = ({ title, content }) => (
  <View className="mb-6">
    <Text className="text-gray-900 font-bold text-lg mb-2">{title}</Text>
    <Text className="text-gray-600 text-base leading-6 text-justify">
      {content}
    </Text>
  </View>
);
