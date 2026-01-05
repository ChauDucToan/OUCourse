<<<<<<< HEAD
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const Banner = ({ navigation, text, subText, item }) => {
  const { width } = Dimensions.get("window");
  return (
    <TouchableOpacity onPress={() => console.log("click banner")}>
      <ImageBackground
        source={item}
        className="w-full h-52 rounded-xl"
        style={{ width: width }}
=======
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";

const Banner = ({ navigation, text, subText, item }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("CourseDetail", { courseId: "123" })}
    >
      <ImageBackground
        source={item} // ảnh demo
        className="w-80 p-4 m-4 h-40 rounded-xl overflow-hidden"
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
      >
        <View className="flex-1 rounded-xl bg-black/40 justify-center px-4">
          <Text className="text-white text-xl font-bold">{text}</Text>
          <Text className="text-white text-sm">{subText}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
export default Banner;
