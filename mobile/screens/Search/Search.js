<<<<<<< HEAD
import { useEffect } from "react";
=======
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
import { useState } from "react";
import { FlatList } from "react-native";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { View, ScrollView } from "react-native";
<<<<<<< HEAD
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";
import HeaderBack from "../../components/HeaderBack";
import { Icon } from "react-native-paper";
=======
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3

const mockCourses = [
  { id: "1", title: "React Native cơ bản", teacher: "Nguyễn Văn A" },
  { id: "2", title: "Thiết kế UI/UX", teacher: "Trần Thị B" },
  { id: "3", title: "Python cho người mới", teacher: "Lê Văn C" },
];

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
<<<<<<< HEAD
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
=======

  const handleSearch = (text) => {
    setKeyword(text);
    const filter = mockCourses.filter((course) =>
      course.title.toLowerCase().includes(text.toLowerCase()),
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
    );
    setResults(filter);
  };

  return (
<<<<<<< HEAD
    <View className="flex-1 bg-slate-50 pt-10">
      <View className="flex-row items-center ">
        <HeaderBack />
        <View className="flex-1 flex-row items-center  py-1">
          <Text className="text-xl">Thanh tìm kiếm</Text>
        </View>
      </View>
      <View className="pl-2  justify-center text-center pr-2 bg-white">
        <TextInput
          className=" text-base bg-gray-200 text-gray-700 mb-4 rounded-xl p-3"
          placeholder="Nhập từ khóa..."
          value={keyword}
          onChangeText={handleSearch}
        />
      </View>
      <View className="flex-row p-4 bg-slate-50 gap-3 border-t border-b border-slate-200 pl-2">
=======
    <ScrollView className="flex-1 bg-white px-4 pt-6 mt-6">
      <Text className="font-bold mb-2 text-xl">Thanh tìm kiếm</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 mb-4 "
        placeholder="Nhập từ khóa..."
        value={keyword}
        onChangeText={handleSearch}
      />

      <View className="flex-row mb-4 gap-3">
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
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

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
<<<<<<< HEAD
            className="border-b border-gray-200 bg-white py-3"
            onPress={() =>
              nav.navigate("CourseDetailedScreen", { id: item.id })
            }
          >
            <View className="p-2">
              <Text className="text-base font-medium">{item.subject}</Text>
              <Text className="text-sm text-gray-500">{item.instructor}</Text>
            </View>
=======
            className="border-b border-gray-200 py-3"
            onPress={() => console.log("Ok!")}
          >
            <Text className="text-base font-medium">{item.title}</Text>
            <Text className="text-sm text-gray-500">{item.teacher}</Text>
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
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
<<<<<<< HEAD
    </View>
=======
    </ScrollView>
>>>>>>> 9371c906eb323960f6cc838b74faaf7cd0d160e3
  );
};
export default Search;
