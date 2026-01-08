import { Text } from "react-native";
import { Image } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";

const CourseView = ({ navigation, item, theme }) => {
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
      className=" mb-4 mt-4 mx-4 rounded-3xl overflow-hidden shadown-sm border flex-row p-5"
      style={{
        backgroundColor: theme.colors.slate[50],
        borderColor: theme.colors.slate[100],
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: item?.image }}
          className="w-28 h-28 rounded-2xl "
          resizeMode="cover"
          style={{
            backgroundColor: theme.colors.slate[200],
          }}
        ></Image>
        {item.price < 0 && (
          <View
            className="absolute top-2 left-2 px-2 py-0.5 rounded-lg"
            style={{
              backgroundColor: theme.colors.green[500],
            }}
          >
            <Text
              className="text-[10px] font-bold"
              style={{
                color: theme.colors.white,
              }}
            >
              FREE
            </Text>
          </View>
        )}
      </View>
      <View className="flex-1 ml-4 justify-between py-1">
        <View>
          <Text
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{
              color: theme.colors.slate[400],
            }}
          >
            {item?.category || "Khóa học"}
          </Text>
          <Text
            numberOfLines={2}
            className="text-base font-bold w-60 leading-5 mt-1"
            style={{
              color: theme.colors.slate[800],
            }}
          >
            {item?.subject}
          </Text>
          <View className="flex-row items-center mt-1">
            <Icon
              source="account-circle-outline"
              size={14}
              color={theme.colors.slate[400]}
            />
            <Text
              className=" text-xs ml-1 italic"
              style={{
                color: theme.colors.slate[500],
              }}
            >
              {item?.instructor}
            </Text>
          </View>
        </View>

        <View className="flex-row items-end justify-between">
          <Text
            className=" text-lg font-black"
            style={{
              color: theme.colors.green[500],
            }}
          >
            {Number(item.price) > 0
              ? formatCurrency(Number(item.price))
              : "Miễn phí"}{" "}
          </Text>
          <View
            className=" p-1.5 rounded-xl"
            style={{
              backgroundColor: theme.colors.slate[100],
            }}
          >
            <Icon
              source="chevron-right"
              size={20}
              color={theme.colors.slate[600]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default CourseView;
