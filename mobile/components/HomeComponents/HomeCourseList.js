import { View } from "react-native";
import TextCustom from "../TextCustom";
import { FlatList } from "react-native";
import { Icon } from "react-native-paper";
import CourseView from "../CourseComponents/CourseView";

import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export const HomeCourseList = ({
  data,
  text,
  icon,
  textClass = {},
  iconColor,
  theme,
}) => {
  const nav = useNavigation();
  const [count, setCount] = useState(20);

  const loadMore = () => {
    setCount((prev) => prev + 20);
  };
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
        data={data.slice(0, count)}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="gap-3 "
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseView theme={theme} navigation={nav} item={item} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};
