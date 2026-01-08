import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
const imageBanner = {
  1: require("../assets/banner_1.png"),
  2: require("../assets/banner_2.png"),
  3: require("../assets/banner_3.png"),
  4: require("../assets/banner_4.png"),
};
const Banner = ({ navigation, text, subText, item }) => {
  const { width } = Dimensions.get("window");
  return (
    <TouchableOpacity
      delayPressIn={0.5}
      onPress={() => navigation.navigate("CourseDetail", { courseId: "123" })}
    >
      <ImageBackground
        source={imageBanner[item.id]}
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
