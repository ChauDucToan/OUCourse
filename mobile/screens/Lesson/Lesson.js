import React, { useState } from "react";
import {
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import HeaderCustom from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import TextCustom from "../../components/TextCustom";
import RenderHTML from "react-native-render-html";
import { lessons } from "../../mock/data.mock.lessons.json";
import { FlatList } from "react-native";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { useMemo } from "react";

const LessonsRoute = ({ lessons, id, theme }) => {
  const filterLesson = useMemo(() => {
    return lessons.filter((lesson) => String(lesson.course) === String(id));
  }, [lessons, id]);

  const nav = useNavigation();
  return (
    <View
      className="flex-1 p-4"
      style={{ backgroundColor: theme.colors.gray[100] }}
    >
      <TextCustom.TextSection
        style={{ color: theme.colors.slate[800] }}
        text="Danh sách các bài học"
      />

      <FlatList
        className="mt-4"
        data={filterLesson}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View>
            <TouchableOpacity
              activeOpacity={0.6}
              delayPressIn={0.7}
              onPress={() => {
                nav.navigate("LessonLearning", { lesson: item, theme: theme });
              }}
            >
              <View
                className="flex-row item-start gap-3 m-2 border rounded-xl p-2"
                style={{ borderColor: theme.colors.gray[300] }}
              >
                <View
                  className=" p-2 rounded-xl items-center justify-center mr-3 w-24"
                  style={{ backgroundColor: theme.colors.blue[500] }}
                >
                  <TextCustom.TextFocus
                    text={`Bài học ${(index + 1).toString()}`}
                    className="w-24 text-center"
                    style={{
                      color: theme.colors.gray[200],
                    }}
                  />
                </View>

                <View className="flex-1">
                  <TextCustom.TextFocus
                    text={item.subject}
                    className="text-base font-medium"
                    style={{ color: theme.colors.slate[800] }}
                  />
                  <TextCustom.TextFocus
                    text="15:00 phút"
                    className=" text-xs"
                    style={{ color: theme.colors.slate[400] }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-10">
            <TextCustom.TextFocus
              text="Không có bài học nào cho khóa học này."
              style={{ color: theme.colors.slate[600] }}
            />
          </View>
        )}
      />
    </View>
  );
};

const DescriptionRoute = ({ description, theme }) => {
  const { width } = useWindowDimensions();
  const source = {
    html: description || "<p>Không có mô tả</p>",
  };
  return (
    <View
      className="flex-1 p-4 "
      style={{ backgroundColor: theme.colors.gray[100] }}
    >
      <RenderHTML
        source={source}
        baseStyle={{ fontSize: 18, color: theme.colors.slate[600] }}
        contentWidth={width}
      />
    </View>
  );
};

export const LessonScreen = () => {
  const { theme } = useContext(MyColorContext);

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
        return (
          <LessonsRoute lessons={lessons} id={route.courseId} theme={theme} />
        );
      case "desc":
        return (
          <DescriptionRoute description={route.description} theme={theme} />
        );
      default:
        return null;
    }
  };
  return (
    <View
      className=" pt-10 flex-1"
      style={{
        backgroundColor: theme.colors.gray[100],
      }}
    >
      <HeaderCustom text="" />
      <View className="p-5">
        <TextCustom.TextSection
          style={{ color: theme.colors.slate[800] }}
          text={item.subject}
        />
        <TextCustom.TextFocus
          text={item.instructor}
          style={{ color: theme.colors.slate[600] }}
        />
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
            style={{
              backgroundColor: theme.colors.gray[100],
            }}
            activeColor={theme.colors.slate[800]}
            inactiveColor={theme.colors.slate[500]}
            labelStyle={{ color: theme.colors.slate[700], fontWeight: "bold" }}
          />
        )}
      />
    </View>
  );
};
