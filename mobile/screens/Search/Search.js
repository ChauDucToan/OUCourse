import { useEffect } from "react";
import { useState } from "react";
import { FlatList } from "react-native";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import HeaderCustom from "../../components/Header";
import { ImageBackground } from "react-native";
import { useMemo } from "react";
import { HomeCategories } from "../../components/HomeComponents/HomeCategories";
import { ScrollView } from "react-native";
import { Icon } from "react-native-paper";
import { useCourses } from "../../hooks/useCourses";
import { useColors } from "../../hooks/useColors";
import { ActivityIndicator } from "react-native";

const Search = () => {
  const nav = useNavigation();
  const [keyword, setKeyword] = useState("");
  const { theme } = useColors();
  const { courses, ensureHomeCourses, loadingCourses } = useCourses();

  const [count, setCount] = useState(20);
  const [sortOption, setSortOption] = useState(null);

  useEffect(() => {
    ensureHomeCourses();
  }, [ensureHomeCourses]);

  const loadMore = () => {
    if (count < coursesFilter.length) {
      setCount((prev) => prev + 20);
    }
  };
  const coursesFilter = useMemo(() => {
    let result = courses.filter((c) => c.status !== "ENROLLED");
    const q = keyword.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (course) =>
          (course.subject ?? "").toLowerCase().includes(q) ||
          (course.instructor ?? "").toLowerCase().includes(q),
      );
    }
    result = [...result];
    switch (sortOption) {
      case "name_asc":
        result.sort((a, b) => (a.subject ?? "").localeCompare(b.subject ?? ""));
        break;
      case "price_asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    return result;
  }, [courses, keyword, sortOption]);
  const SortChip = ({ label, value, icon, theme }) => {
    const isActive = sortOption === value;
    return (
      <TouchableOpacity
        onPress={() => setSortOption(isActive ? null : value)}
        className={`flex-row items-center px-3 py-2 rounded-full mr-2 border`}
        style={{
          backgroundColor: isActive
            ? theme.colors.slate[800]
            : theme.colors.gray[50],
          borderColor: isActive
            ? theme.colors.slate[800]
            : theme.colors.slate[200],
        }}
      >
        <Text
          style={{
            color: isActive ? theme.colors.white : theme.colors.slate[600],
            fontWeight: isActive ? "bold" : "normal",
          }}
        >
          {label}
        </Text>
        {isActive && icon && (
          <Icon
            name={icon}
            size={16}
            color={theme.colors.slate[400]}
            style={{ marginLeft: 4 }}
          />
        )}
      </TouchableOpacity>
    );
  };
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
          onChangeText={(text) => {
            (setKeyword(text), setCount(20));
          }}
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
      <View className="px-2 pb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SortChip
            label="Tên A-Z"
            value="name_asc"
            icon="sort-alphabetical-ascending"
            theme={theme}
          />
          <SortChip
            label="Giá thấp nhất"
            value="price_asc"
            icon="arrow-up"
            theme={theme}
          />
          <SortChip
            label="Giá cao nhất"
            value="price_desc"
            icon="arrow-down"
            theme={theme}
          />
        </ScrollView>
      </View>
      {loadingCourses ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
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
      )}
    </View>
  );
};
export default Search;
