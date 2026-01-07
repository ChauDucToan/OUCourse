import { useEffect } from "react";

import { useState } from "react";
import { FlatList } from "react-native";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { View, ScrollView } from "react-native";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";
import HeaderBack from "../../components/HeaderBack";
import { Icon } from "react-native-paper";
import HeaderCustom from "../../components/Header";
import { results } from "../../mock/data.mock.courses.json";
import { ImageBackground } from "react-native";
import { StyleSheet } from "nativewind";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
const mockCourses = [
  { id: "1", title: "React Native cơ bản", teacher: "Nguyễn Văn A" },
  { id: "2", title: "Thiết kế UI/UX", teacher: "Trần Thị B" },
  { id: "3", title: "Python cho người mới", teacher: "Lê Văn C" },
];

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [resultsSearch, setResultsSearch] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const { theme } = useContext(MyColorContext);
  const nav = useNavigation();
  useEffect(() => {
    const loadData = async () => {
      try {
        let res = await axiosClient.get(endpoints.courses);
        // setCoursesData(res.data.results);
        setCoursesData(results);
        setResultsSearch(res.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
    console.log(coursesData);
  }, []);
  const handleSearch = (text) => {
    setKeyword(text);
    if (!text.trim()) {
      // setResults(coursesData);
      setResultsSearch(results);
      return;
    }
    // coursesData
    const filter = results.filter((course) =>
      course.subject.toLowerCase().includes(text.toLowerCase()),
    );
  };

  return (
    <View
      className="flex-1  pt-10"
      style={{
        backgroundColor: theme.colors.slate[50],
      }}
    >
      <HeaderCustom text="Thanh tìm kiếm" />
      <View
        className="pl-2  justify-center text-center pr-2"
        style={{
          backgroundColor: theme.colors.white,
        }}
      >
        <TextInput
          className=" text-base border mb-4 rounded-2xl p-3"
          style={{
            backgroundColor: theme.colors.gray[50],
            borderColor: theme.colors.gray[200],
            color: theme.colors.gray[700],
          }}
          placeholder="Nhập từ khóa..."
          value={keyword}
          onChangeText={handleSearch}
        />
      </View>
      <View
        className="flex-row p-4 gap-3 border-t border-b  pl-2"
        style={{
          backgroundColor: theme.colors.gray[50],
          borderColor: theme.colors.gray[200],
        }}
      >
        <View className="flex-row  gap-3">
          {["React", "UX/UI", "Golang"].map((tag) => (
            <TouchableOpacity
              key={tag}
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: theme.colors.gray[200],
              }}
              onPress={() => handleSearch(tag)}
            >
              <Text className="text-sm">{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={coursesData}
        keyExtractor={(item) => item.id}
        className="p-2"
        contentContainerStyle={{
          paddingBottom: 32,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.white,
              borderColor: theme.colors.gray[200],
            }}
            onPress={() =>
              nav.navigate("CourseDetailedScreen", { id: item.id })
            }
          >
            <View className="rounded-xl overflow-hidden ">
              <ImageBackground
                source={{ uri: item.image }}
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
  );
};
export default Search;
