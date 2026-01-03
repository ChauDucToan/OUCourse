import { useState } from "react";
import { FlatList } from "react-native";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { View, ScrollView } from "react-native";

const mockCourses = [
  { id: "1", title: "React Native cơ bản", teacher: "Nguyễn Văn A" },
  { id: "2", title: "Thiết kế UI/UX", teacher: "Trần Thị B" },
  { id: "3", title: "Python cho người mới", teacher: "Lê Văn C" },
];

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (text) => {
    setKeyword(text);
    const filter = mockCourses.filter((course) =>
      course.title.toLowerCase().includes(text.toLowerCase()),
    );
    setResults(filter);
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6 mt-6">
      <Text className="font-bold mb-2 text-xl">Thanh tìm kiếm</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 mb-4 "
        placeholder="Nhập từ khóa..."
        value={keyword}
        onChangeText={handleSearch}
      />

      <View className="flex-row mb-4 gap-3">
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
            className="border-b border-gray-200 py-3"
            onPress={() => console.log("Ok!")}
          >
            <Text className="text-base font-medium">{item.title}</Text>
            <Text className="text-sm text-gray-500">{item.teacher}</Text>
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
    </ScrollView>
  );
};
export default Search;
