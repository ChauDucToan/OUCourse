import { View } from "react-native";
import TextCustom from "../TextCustom";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CourseView from "../CourseView";

export const HomeCourseList = ({ data, text }) => {
  const nav = useNavigation();
  return (
    <View>
      <View className="pl-5">
        <TextCustom.TextSection text={text} />
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
