import { View, Text, ImageBackground, TouchableOpacity } from "react-native";

const Banner = ({ navigation, text, subText, item }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("CourseDetail", { courseId: "123" })}
    >
      <ImageBackground
        source={item}
        className="w-80 p-4 m-4 h-40 rounded-xl overflow-hidden"
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
