import React from "react";
import { View, Text, FlatList } from "react-native";
import { Button } from "react-native-paper";
import HeaderCustom from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { CourseContext } from "../../utils/contexts/CoursesContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { useEffect } from "react";
import { useState } from "react";

// Component hiển thị từng khóa học
const CourseCard = ({ course, onEdit, onView, theme, navigation }) => (
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
      {course.subject}
    </Text>
    <Text className="text-sm " style={{ color: theme.colors.gray[400] }}>
      Giá: {course.price > 0 ? formatCurrency(course.price) : "Miễn phí"} VNĐ
    </Text>
    {/* <Text className="text-sm " style={{ color: theme.colors.gray[400] }}>
      Học viên: {course.students}
    </Text>*/}
    {/* <Text className="text-sm " style={{ color: theme.colors.gray[400] }}>
      Trạng thái: {course.status}
    </Text>*/}

    <View className="flex-row gap-3 mt-3">
      <Button
        mode="outlined"
        style={{
          backgroundColor: theme.colors.slate[300],
          borderColor: theme.colors.gray[500],
        }}
        onPress={() =>
          navigation.navigate("MangeCourseDetailed", {
            course: course,
            theme: theme,
          })
        }
      >
        Xem chi tiết
      </Button>
      <Button
        mode="contained"
        textColor={theme.colors.gray[100]}
        onPress={() =>
          navigation.navigate("EditMyCourse", { course: course, theme: theme })
        }
      >
        Chỉnh sửa
      </Button>
    </View>
  </View>
);

// Component chính: InstructorCourses
const InstructorCourses = () => {
  const { instructorCourse, ensureInstructorCourse, loadingCourses } =
    useContext(CourseContext);
  useEffect(() => {
    ensureInstructorCourse();
    console.log("INSTRUCTOR COURSE", instructorCourse);
  }, []);
  const [count, setCount] = useState(20);

  const loadMore = () => {
    setCount((prev) => prev + 20);
  };
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
      </View>
      <View
        className="flex-1"
        style={{ backgroundColor: theme.colors.gray[100] }}
      >
        {loadingCourses ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.slate[600]}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={instructorCourse.slice(0, count)}
            className="p-2"
            contentContainerStyle={{ paddingBottom: 30 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.6}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CourseCard theme={theme} course={item} navigation={nav} />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default InstructorCourses;
