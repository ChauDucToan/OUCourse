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
    <TouchableOpacity
      delayPressIn={0.5}
      onPress={() => navigation.navigate("CourseDetail", { courseId: "123" })}
    >
      <ImageBackground
        source={item}
        style={{ width: width }}
        className="w-full  h-52 overflow-hidden"
      >
        <View className="flex-1  bg-black/40 justify-center px-4">
          <Text className="text-white text-xl font-bold">{text}</Text>
          <Text className="text-white text-sm">{subText}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
export default Banner;
