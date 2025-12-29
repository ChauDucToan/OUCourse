import Card from "./components/Card";
import "./global.css";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Card text="Khóa luyện tinh thần" price="500.000.000VND" author="DTK" />
      <Card
        text="Khóa luyện nội công"
        price="236.000.000VND"
        author="Oslamelon"
      />
    </View>
  );
}
