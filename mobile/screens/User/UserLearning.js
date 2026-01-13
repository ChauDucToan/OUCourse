import HeaderCustom from "../../components/Header";
import { TouchableOpacity, View } from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { Image } from "react-native";

import { results } from "../../mock/data.mock.courses.json";
import TextCustom from "../../components/TextCustom";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { CourseContext } from "../../utils/contexts/CoursesContext";

const UserLearning = () => {
  // const { courses, ensureCourses, refreshCourses } = useContext(CourseContext);

  // useEffect(() => {
  //   ensureCourses();
  // }, [ensureCourses]);
  const nav = useNavigation();
  const { theme } = useContext(MyColorContext);
  return (
    <View
      className="pt-10 flex-1"
      style={{ backgroundColor: theme.colors.gray[100] }}
    >
      <HeaderCustom text="Danh sách bài học của tôi" />
      <View style={{ backgroundColor: theme.colors.slate[300] }}>
        {/* <FlatList
          data={courses}
          contentContainerStyle={{
            paddingBottom: 52,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              delayPressIn={0.6}
              activeOpacity={0.6}
              onPress={() =>
                nav.navigate("Lesson", {
                  item: item,
                })
              }
            >
              <View
                className="flex-row p-2 items-center border"
                style={{
                  backgroundColor: theme.colors.slate[200],
                  borderColor: theme.colors.gray[700],
                }}
              >
                <View className="mb-2 ml-2">
                  <Image
                    className="w-24 h-24 rounded-xl"
                    source={
                      item.image
                        ? { uri: item.image }
                        : require("../../assets/banner_1.png")
                    }
                  />
                </View>
                <View className="justify-end border-b flex-1 m-2 border-gray-200">
                  <TextCustom.TextMuted
                    text={item.category}
                    style={{
                      color: theme.colors.slate[500],
                    }}
                  />
                  <View className="item-start">
                    <TextCustom.TextSection
                      className="text-base  "
                      style={{ color: theme.colors.yellow[500] }}
                      text={item.subject}
                    />
                  </View>
                  <TextCustom.TextFocus
                    text={item.instructor}
                    style={{ color: theme.colors.blue[500] }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />*/}
      </View>
    </View>
  );
};

export default UserLearning;
