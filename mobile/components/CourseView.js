import { Dimensions } from "react-native";
import { Text } from "react-native";
import { ImageBackground } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { RenderHTML } from "react-native-render-html";
const CourseView = ({ navigation, item }) => {
  const { width } = Dimensions.get("window");

  return (
    <TouchableOpacity>
      <ImageBackground
        source={{ uri: item?.image }}
        className="w-full h-40 rounded-xl mt-4"
        style={{ width: width }}
      >
        <View className="flex-1 rounded-xl bg-black/40 justify-center px-4">
          <Text className="text-white text-xl font-bold">
            {item?.instructor}
          </Text>
          <Text className="text-white text-base">{item?.subject}</Text>

          {/* <RenderHTML source={item?.description}></RenderHTML>*/}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
export default CourseView;
