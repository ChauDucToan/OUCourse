import { View, Text, FlatList } from "react-native";
import { Button } from "react-native-paper";
import HeaderCustom from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { formatCurrency } from "../../utils/formatCurrency";
import { useEffect } from "react";
import { useState } from "react";
import { useCourses } from "../../hooks/useCourses";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { ActivityIndicator } from "react-native";
import { useColors } from "../../hooks/useColors";

const CourseCard = ({ course, onDelete, theme, navigation }) => (
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

    <View className="flex-row flex-wrap  gap-3 mt-3">
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
        Xem
      </Button>
      <Button
        mode="contained"
        textColor={theme.colors.gray[100]}
        onPress={() =>
          navigation.navigate("EditMyCourse", { course: course, theme: theme })
        }
      >
        Sửa
      </Button>
      <Button
        mode="outlined"
        className=""
        onPress={() =>
          navigation.navigate("CreateLesson", {
            courseId: course.id,
          })
        }
      >
        Thêm
      </Button>
      <Button
        mode="outlined"
        textColor={theme.colors.danger}
        onPress={() => onDelete(course.id)}
      >
        Xóa
      </Button>
    </View>
  </View>
);

const InstructorCourses = () => {
  const {
    instructorCourse,
    ensureInstructorCourse,
    loadingCourses,
    setInstructorCourse,
  } = useCourses();
  useEffect(() => {
    ensureInstructorCourse();
  }, [ensureInstructorCourse]);
  const [count, setCount] = useState(20);

  const loadMore = () => {
    setCount((prev) => prev + 20);
  };
  const { theme } = useColors();
  const handleDelete = async (courseId) => {
    try {
      await axiosClient.delete(`${endpoints.courses}${courseId}/`);
      setInstructorCourse((prev) => prev.filter((c) => c.id !== courseId));
      alert("Xóa khóa học thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi xóa khóa học");
    }
  };
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
            keyExtractor={(item, index) =>
              item?.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => (
              <CourseCard
                theme={theme}
                course={item}
                navigation={nav}
                onDelete={handleDelete}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default InstructorCourses;
