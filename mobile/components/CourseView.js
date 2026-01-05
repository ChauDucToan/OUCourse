import { Dimensions } from "react-native";
import { Text } from "react-native";
import { ImageBackground } from "react-native";
import { TouchableOpacity, View } from "react-native";
const CourseView = ({ navigation, item }) => {
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
      <View className="p-2 flex items-center justify-center">
        <ImageBackground
          source={{ uri: item?.image }}
          className="w-52 m-4 h-40 "
        >
          <View className="flex-1 bg-black/40 rounded-xl justify-center px-4"></View>
        </ImageBackground>

        <View className="w-52 p-2 rounded-xl bg-slate-600/20">
          <Text className="text-slate-700 text-xl font-bold">
            {item?.instructor}
          </Text>
          <Text className="text-slate-700 text-sm">{item?.subject}</Text>
          <Text className="text-black text-base  ">
            {item.price >= 0 ? formatCurrency(item.price) : "FREE"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default CourseView;
