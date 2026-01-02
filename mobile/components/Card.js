import { Text, TouchableOpacity, View } from "react-native";

const Card = ({ text, price, author }) => {
  return (
    <View className="m-2 border-2 border-red-500 p-4">
      <TouchableOpacity activeOpacity={0.6}>
        <Text className="text-xl text-blue-500">{text}</Text>
        <Text className="text-sm text-gray-400">{author}</Text>
        <Text className="text-red-500">{price}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Card;
