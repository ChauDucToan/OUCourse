import { useEffect } from "react";
import { useState } from "react";
import { FlatList } from "react-native";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import HeaderCustom from "../../components/Header";
import { ImageBackground } from "react-native";
import { useMemo } from "react";
import { ScrollView } from "react-native";
import { Icon } from "react-native-paper";
import { useCourses } from "../../hooks/useCourses";
import { useColors } from "../../hooks/useColors";
import { ActivityIndicator } from "react-native";
import { endpoints } from "../../utils/Apis";
import axiosClient from "../../api/axiosClient";
import { errorConsole } from "../../utils/errorUtils";

const Search = () => {
  const nav = useNavigation();
  const { theme } = useColors();
  const [courses, setCourses] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);

  const loadCourses = async (pageNum, reset = false) => {
    if (loading) return;
    if (pageNum > 1 && !nextPage && !reset) return;
    setLoading(true);
    try {
      let url = `${endpoints["courses"]}?page=${pageNum}`;
      if (keyword.trim()) {
        url += `&q=${keyword.trim()}`;
      }
      if (sortOption) {
        let ordering = "";
        switch (sortOption) {
          case "name_asc":
            ordering = "subject";
            break;
          case "price_asc":
            ordering = "price";
            break;
          case "price_desc":
            ordering = "-price";
            break;
        }
        if (ordering) url += `&ordering=${ordering}`;
      }
      const res = await axiosClient.get(url);
      const results = res.data.results || [];
      setNextPage(res.data.next);

      if (reset || pageNum === 1) {
        setCourses(results);
      } else {
        setCourses((prev) => [...prev, ...results]);
      }
    } catch (error) {
      errorConsole(error, "fetch");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadCourses(1, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, sortOption]);

  const handleLoadMore = () => {
    if (nextPage && !loading) {
      const newPage = page + 1;
      setPage(newPage);
      loadCourses(newPage);
    }
  };

  const [count, setCount] = useState(20);
  const [sortOption, setSortOption] = useState(null);

  const SortChip = ({ label, value, icon, theme }) => {
    const isActive = sortOption === value;
    return (
      <TouchableOpacity
        onPress={() => setSortOption(isActive ? null : value)}
        className={`flex-row items-center px-3 py-2 rounded-full mr-2 border-2`}
        style={{
          backgroundColor: isActive
            ? theme.colors.slate[700]
            : theme.colors.gray[100],
          borderColor: isActive
            ? theme.colors.slate[300]
            : theme.colors.slate[500],
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
      <HeaderCustom text="Thanh tìm kiếm" targetScreen="Home" />
      <View
        className="pl-2  justify-center text-center pr-2"
        style={{
          backgroundColor: theme.colors.gray[100],
        }}
      >
        <TextInput
          className=" text-base border-2 mb-4  rounded-2xl p-3 "
          style={{
            backgroundColor: theme.colors.gray[50],
            borderColor: theme.colors.slate[500],
            color: theme.colors.slate[400],
          }}
          textColor={theme.colors.slate[600]}
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
      ></View>
      <View className="px-3">
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
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <View
          className="flex-1"
          style={{
            backgroundColor: theme.colors.gray[100],
          }}
        >
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            className="p-2"
            contentContainerStyle={{
              paddingBottom: 30,
            }}
            onEndReached={handleLoadMore}
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
                    style={{
                      borderColor: theme.colors.slate[500],
                    }}
                    className="pt-8 pb-8 pl-4 border-2 mx-3 rounded-xl overflow-hidden mt-3"
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
            ListFooterComponent={
              loading && page > 1 ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : null
            }
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
