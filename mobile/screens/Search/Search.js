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

const mockCourses = [
  { id: "1", title: "React Native cơ bản", teacher: "Nguyễn Văn A" },
  { id: "2", title: "Thiết kế UI/UX", teacher: "Trần Thị B" },
  { id: "3", title: "Python cho người mới", teacher: "Lê Văn C" },
];

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const nav = useNavigation();
  useEffect(() => {
    const loadData = async () => {
      try {
        let res = await axiosClient.get(endpoints.courses);
        setCoursesData(res.data.results);

        setResults(res.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, []);
  const handleSearch = (text) => {
    setKeyword(text);
    if (!text.trim()) {
      setResults(coursesData);
      return;
    }
    const filter = coursesData.filter((course) =>
      course.subject.toLowerCase().includes(text.toLowerCase()),
    );
  };

  return (
    <View className="flex-1 bg-slate-50 pt-10">
      <HeaderCustom text="Thanh tìm kiếm" />
      <View className="pl-2  justify-center text-center pr-2 bg-white">
        <TextInput
          className=" text-base bg-gray-50 border border-gray-200 text-gray-700 mb-4 rounded-2xl p-3"
          placeholder="Nhập từ khóa..."
          value={keyword}
          onChangeText={handleSearch}
        />
      </View>
      <View className="flex-row p-4 bg-slate-50 gap-3 border-t border-b border-slate-200 pl-2">
        <View className="flex-row  gap-3">
          {["React", "UX/UI", "Golang"].map((tag) => (
            <TouchableOpacity
              key={tag}
              className="bg-gray-200 rounded-full px-3 py-1"
              onPress={() => handleSearch(tag)}
            >
              <Text className="text-sm">{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="border-b border-gray-200 bg-white py-3"
            onPress={() =>
              nav.navigate("CourseDetailedScreen", { id: item.id })
            }
          >
            <View className="p-2">
              <Text className="text-base font-medium">{item.subject}</Text>
              <Text className="text-sm text-gray-500">{item.instructor}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          keyword.length > 0 ? (
            <Text className="text-center text-gray-400 mt-4">
              Không tìm thấy khóa học phù hợp
            </Text>
          ) : null
        }
      />
    </View>
  );
};
export default Search;
