import React, { useState } from "react";
import {
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import HeaderCustom from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import TextCustom from "../../components/TextCustom";
import RenderHTML from "react-native-render-html";
import { lessons } from "../../mock/data.mock.lessons.json";
import { FlatList } from "react-native";

const LessonsRoute = ({ lessons, id }) => {
  const filterLessonsData = lessons.filter(
    (lesson) => String(lesson.course) === String(id),
  );
  const nav = useNavigation();
  console.log(filterLessonsData);
  return (
    <View className="flex-1 p-4 bg-white">
      <TextCustom.TextSection text="Danh sách các bài học" />

      <FlatList
        className="mt-4"
        data={filterLessonsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              delayPressIn={0.7}
              onPress={() => {
                nav.navigate("LessonLearning", { lesson: item });
              }}
            >
              <View className="flex-row item-start gap-3 m-2 border border-gray-200 rounded-xl p-2">
                <View className=" bg-blue-100 p-2 rounded-xl items-center justify-center mr-3 w-24">
                  <TextCustom.TextFocus
                    text={`Bài học ${(index + 1).toString()}`}
                    className="w-24 text-center"
                  />
                </View>

                <View>
                  <TextCustom.TextFocus
                    text={item.subject}
                    className="text-slate-800 text-base font-medium "
                  />
                  <TextCustom.TextFocus
                    text="15:00 phút"
                    className="text-slate-400 text-xs"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-10">
            <TextCustom.TextFocus text="Không có bài học nào cho khóa học này." />
          </View>
        )}
      />
    </View>
  );
};

const DescriptionRoute = ({ description }) => {
  const { width } = useWindowDimensions();
  const source = {
    html: description || "<p>Không có mô tả</p>",
  };
  return (
    <View className="flex-1 p-4 bg-white">
      <RenderHTML source={source} contentWidth={width} />
    </View>
  );
};

export const LessonScreen = () => {
  const route = useRoute();
  const { item } = route.params;
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "lessons", title: "Bài học", courseId: item.id },
    { key: "desc", title: "Mô tả", description: item.description },
  ]);

  console.log("NAY", item);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "lessons":
        return <LessonsRoute lessons={lessons} id={route.courseId} />;
      case "desc":
        return <DescriptionRoute description={route.description} />;
      default:
        return null;
    }
  };
  return (
    <View className="bg-slate-50 pt-10 flex-1">
      <HeaderCustom text="" />
      <View className="p-5">
        <TextCustom.TextSection text={item.subject} />
        <TextCustom.TextFocus text={item.instructor} />
        <Image
          source={{ uri: item.image }}
          className="w-full h-48 mt-4 rounded-xl"
        />
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#2563eb" }}
            style={{ backgroundColor: "white" }}
            labelStyle={{ color: "black", fontWeight: "bold" }}
          />
        )}
      />
    </View>
  );
};
