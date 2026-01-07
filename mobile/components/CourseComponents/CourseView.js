import { Text } from "react-native";
import { Image } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";
import colors from "tailwindcss/colors";
const CourseView = ({ navigation, item }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("Search", {
          screen: "CourseDetailedScreen",
          params: { id: item.id },
        })
      }
      className="bg-white  mb-4 mt-4 mx-4 rounded-3xl overflow-hidden shadown-sm border border-slate-100 flex-row p-5"
    >
      <View className="relative">
        <Image
          source={{ uri: item?.image }}
          className="w-28 h-28 rounded-2xl bg-slate-200 "
          resizeMode="cover"
        ></Image>
        {item.price < 0 && (
          <View className="absolute top-2 left-2 bg-green-500 px-2 py-0.5 rounded-lg">
            <Text className="text-white text-[10px] font-bold">FREE</Text>
          </View>
        )}
      </View>
      <View className="flex-1 ml-4 justify-between py-1">
        <View>
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            {item?.category || "Khóa học"}
          </Text>
          <Text
            numberOfLines={2}
            className="text-slate-800 text-base font-bold leading-5 mt-1"
          >
            {item?.subject}
          </Text>
          <View className="flex-row items-center mt-1">
            <Icon
              source="account-circle-outline"
              size={14}
              color={colors.slate[400]}
            />
            <Text className="text-slate-500 text-xs ml-1 italic">
              {item?.instructor}
            </Text>
          </View>
        </View>

        <View className="flex-row items-end justify-between">
          <Text className="text-blue-600 text-lg font-black">
            {item.price >= 0 ? formatCurrency(item.price) : "Miễn phí"}
          </Text>
          <View className="bg-slate-100 p-1.5 rounded-xl">
            <Icon source="chevron-right" size={20} color={colors.slate[600]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default CourseView;
