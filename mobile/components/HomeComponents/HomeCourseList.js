import { View } from "react-native";
import TextCustom from "../TextCustom";
import { FlatList } from "react-native";
import { Icon } from "react-native-paper";
import CourseView from "../CourseComponents/CourseView";

import { useNavigation } from "@react-navigation/native";

export const HomeCourseList = ({
  data,
  text,
  icon,
  textClass = {},
  iconColor,
  theme,
}) => {
  const nav = useNavigation();

  return (
    <View>
      <View className="pl-5 flex-row gap-3 items-center">
        <Icon
          source={icon}
          size={28}
          color={iconColor ? iconColor : theme.colors.slate[600]}
        />
        <TextCustom.TextSection style={textClass} text={text} />
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="gap-3 "
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseView theme={theme} navigation={nav} item={item} />
        )}
      />
    </View>
  );
};
