import React from "react";
import { View, Text, FlatList } from "react-native";
import { Button } from "react-native-paper";
import HeaderCustom from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

// Component hiển thị từng khóa học
const CourseCard = ({ course, onEdit, onView, theme }) => (
  <View
    className="border border-gray-300 rounded-xl p-4 mb-3 bg-white"
    style={{
      backgroundColor: theme.colors.slate[200],
      borderColor: theme.colors.gray[300],
    }}
  >
    <Text
      className="text-lg font-semibold"
      style={{ color: theme.colors.slate[600] }}
    >
      {course.name}
    </Text>
    <Text className="text-sm " style={{ color: theme.colors.gray[400] }}>
      Giá: {course.price} VNĐ
    </Text>
    <Text className="text-sm " style={{ color: theme.colors.gray[400] }}>
      Học viên: {course.students}
    </Text>
    <Text className="text-sm " style={{ color: theme.colors.gray[400] }}>
      Trạng thái: {course.status}
    </Text>

    <View className="flex-row gap-3 mt-3">
      <Button
        mode="outlined"
        style={{
          backgroundColor: theme.colors.slate[300],
          borderColor: theme.colors.gray[500],
        }}
        onPress={() => onView(course.id)}
      >
        Xem chi tiết
      </Button>
      <Button
        mode="contained"
        textColor={theme.colors.gray[100]}
        onPress={() => onEdit(course.id)}
      >
        Chỉnh sửa
      </Button>
    </View>
  </View>
);

// Component chính: InstructorCourses
const InstructorCourses = () => {
  // Data mẫu
  const courses = [
    {
      id: 1,
      name: "Lập trình React Native",
      price: 1200000,
      students: 35,
      status: "Đang mở",
    },
    {
      id: 2,
      name: "Thiết kế UI/UX cơ bản",
      price: 950000,
      students: 20,
      status: "Đã kết thúc",
    },
    {
      id: 3,
      name: "Node.js nâng cao",
      price: 1500000,
      students: 50,
      status: "Đang mở",
    },
  ];
  const { theme } = useContext(MyColorContext);
  const handleEdit = (id) => console.log("Chỉnh sửa khóa học", id);
  const handleView = (id) => console.log("Xem chi tiết khóa học", id);
  const nav = useNavigation();
  return (
    <View
      className="pt-10 flex-1"
      style={{ backgroundColor: theme.colors.gray[100] }}
    >
      <View className="p-4">
        <HeaderCustom text={"Khóa học của tôi"} />

        <Button
          mode="contained"
          textColor={theme.colors.gray[100]}
          onPress={() => {
            nav.navigate("CourseEditor");
          }}
          className="mb-4"
        >
          Tạo khóa học mới
        </Button>

        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CourseCard
              theme={theme}
              course={item}
              onEdit={handleEdit}
              onView={handleView}
            />
          )}
        />
      </View>
    </View>
  );
};

export default InstructorCourses;
