import { useEffect } from "react";
import { useState } from "react";
import { FlatList } from "react-native";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import HeaderCustom from "../../components/Header";
import { ImageBackground } from "react-native";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { CourseContext } from "../../utils/contexts/CoursesContext";
import { CategoriesContext } from "../../utils/contexts/CategoriesContext";
import { useMemo } from "react";
import { HomeCategories } from "../../components/HomeComponents/HomeCategories";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const { theme } = useContext(MyColorContext);
  const { courses, ensureCourses } = useContext(CourseContext);
  const { categories, ensureCategories } = useContext(CategoriesContext);
  const [count, setCount] = useState(20);

  const loadMore = () => {
    setCount((prev) => prev + 20);
  };
  const coursesFilter = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((course) =>
      (course.subject ?? "").toLowerCase().includes(q),
    );
  }, [courses, keyword]);
  const nav = useNavigation();
  useEffect(() => {
    ensureCategories();
  }, [ensureCategories]);
  useEffect(() => {
    ensureCourses();
  }, [ensureCourses]);

  return (
    <View
      className="flex-1  pt-10"
      style={{
        backgroundColor: theme.colors.gray[100],
      }}
    >
      <HeaderCustom text="Thanh tìm kiếm" />
      <View
        className="pl-2  justify-center text-center pr-2"
        style={{
          backgroundColor: theme.colors.gray[100],
        }}
      >
        <TextInput
          className=" text-base border  rounded-2xl p-3 "
          style={{
            backgroundColor: theme.colors.gray[50],
            borderColor: theme.colors.slate[200],
          }}
          placeholderTextColor={theme.colors.slate[400]}
          placeholder="Nhập từ khóa..."
          value={keyword}
          onChangeText={setKeyword}
        />
      </View>

      <View
        style={{
          backgroundColor: theme.colors.gray[50],
          borderColor: theme.colors.gray[200],
        }}
      >
        <HomeCategories sizeIcon={0} theme={theme} />
      </View>
      <View
        className="flex-1"
        style={{
          backgroundColor: theme.colors.gray[100],
        }}
      >
        <FlatList
          data={coursesFilter.slice(0, count)}
          keyExtractor={(item) => item.id}
          className="p-2 "
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.gray[100],
                borderColor: theme.colors.gray[200],
              }}
              onPress={() =>
                nav.navigate("CourseDetailedScreen", { id: item.id })
              }
            >
              <View className="rounded-xl overflow-hidden ">
                <ImageBackground
                  source={
                    item.image
                      ? { uri: item.image }
                      : require("../../assets/banner_1.png")
                  }
                  className="pt-8 pb-8 pl-4 mx-3 rounded-xl overflow-hidden mt-3"
                >
                  <View className="absolute inset-0  bg-black/40" />
                  <View className="p-2">
                    <Text className="text-base text-white font-medium">
                      {item.subject}
                    </Text>
                    <Text className="text-sm text-white/70">
                      {item.instructor}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            keyword.length > 0 ? (
              <Text
                className="text-center mt-4"
                style={{
                  color: theme.colors.gray[400],
                }}
              >
                Không tìm thấy khóa học phù hợp
              </Text>
            ) : null
          }
        />
      </View>
    </View>
  );
};
export default Search;
