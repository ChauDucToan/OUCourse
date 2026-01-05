import { Dimensions } from "react-native";
import { Text } from "react-native";
import { ImageBackground } from "react-native";
import { TouchableOpacity, View } from "react-native";
const CourseView = ({ navigation, item }) => {
  const { width } = Dimensions.get("window");
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Search", {
          screen: "CourseDetailedScreen",
          params: { id: item.id },
        })
      }
    >
      <ImageBackground
        source={{ uri: item?.image }}
        className="w-full h-40 mt-5"
        style={{ width: width }}
      >
        <View className="flex-1 bg-black/40 rounded-none justify-center px-4">
          <Text className="text-white text-xl font-bold">
            {item?.instructor}
          </Text>
          <Text className="text-white text-base">{item?.subject}</Text>
          <View>
            <Text className="text-white text-xl  ">
              {formatCurrency(item.price)}
            </Text>
          </View>
          {/* <RenderHTML source={item?.description}></RenderHTML>*/}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
export default CourseView;
