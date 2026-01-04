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
