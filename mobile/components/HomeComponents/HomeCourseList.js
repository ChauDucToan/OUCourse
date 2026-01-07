import { View } from "react-native";
import TextCustom from "../TextCustom";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-paper";
import colors from "tailwindcss/colors";
import CourseView from "../CourseComponents/CourseView";
export const HomeCourseList = ({
  data,
  text,
  icon,
  textClass = "",
  iconColor,
}) => {
  const nav = useNavigation();

  return (
    <View>
      <View className="pl-5 flex-row gap-3 items-center">
        <Icon
          source={icon}
          size={28}
          color={iconColor ? iconColor : colors.slate[600]}
        />
        <TextCustom.TextSection className={textClass} text={text} />
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="gap-3 "
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseView navigation={nav} item={item} />}
      />
    </View>
  );
};
