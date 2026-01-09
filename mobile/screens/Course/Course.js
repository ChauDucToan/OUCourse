import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { Icon } from "react-native-paper";
import HeaderCustom from "../../components/Header";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

import { useContext, useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { useNavigation, useRoute } from "@react-navigation/native";

const CourseDetailedScreen = () => {
  const route = useRoute();
  const [course, setCourse] = useState();
  const [isLoading, setLoading] = useState(false);
  const { theme } = useContext(MyColorContext);
  const { id } = route.params;
  const { width } = Dimensions.get("window");
  const nav = useNavigation();
  useEffect(() => {
    const loadData = async () => {
      try {
        const params = `${endpoints.courses}${id}/`;
        let res = await axiosClient.get(params);

        setCourse(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (id) loadData();
  }, [id]);
  useEffect(() => {
    if (course) {
      console.log("Dữ liệu khóa học đã cập nhật:", course);
    }
  }, [course]);

  if (!course) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải thông tin khóa học...</Text>
      </View>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const handleEnroll = async (course) => {
    try {
      // "id": 7,
      // "subject": "Machine Learning căn bản",
      // "instructor": "Ngô Tiến Đạt",
      // "image": "https://img.freepik.com/free-vector/machine-learning-concept-illustration_114360-3908.jpg",
      // "category": "Data Science",
      // "description": "<strong>Thuật toán và Ứng dụng</strong><p>Tìm hiểu Linear Regression, Decision Trees và cách huấn luyện mô hình dự đoán đầu tiên.</p>",
      // "price": 800000

      const formData = new FormData();
      formData.append("id", course.id);
      formData.append("status", "ENROLLED");
      const res = await axiosClient.post(
        endpoints.enrollCourse(course.id),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      console.log("Enroll DONE");

      console.log("RES enrroll: ", res);
      nav.goBack();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View
      className=" flex-1"
      style={{
        backgroundColor: theme.colors.white,
      }}
    >
      <ScrollView
        className="pt-10 "
        style={{
          backgroundColor: theme.colors.white,
        }}
      >
        <HeaderCustom text={course.subject} />
        <View>
          <ImageBackground
            source={{ uri: course.image }}
            className="w-full h-52 rounded-xl"
            style={{ width: width }}
          ></ImageBackground>
          <View className="px-5 -mt-8  pt-8 shadow-2xl">
            <View
              className="flex-row items-center mt-6  rounded-2xl"
              style={{
                backgroundColor: theme.colors.gray[50],
              }}
            >
              <View
                className=" p-2 rounded-full"
                style={{
                  backgroundColor: theme.colors.slate[500],
                }}
              >
                <Icon source="account-tie" size={24} color="white" />
              </View>
              <View className="ml-4">
                <Text
                  className=" text-xs"
                  style={{
                    color: theme.colors.gray[400],
                  }}
                >
                  Giảng viên chuyên môn
                </Text>
                <Text
                  className=" text-lg font-bold"
                  style={{
                    color: theme.colors.gray[900],
                  }}
                >
                  {course.instructor}
                </Text>
              </View>
            </View>
            <View className="mt-8 mb-20">
              <Text
                className="text-xl font-bold  mb-2 tracking-tight"
                style={{
                  color: theme.colors.gray[900],
                }}
              >
                Giới thiệu khóa học
              </Text>
              <Text className="text-xs uppercase  tracking-tight font-semibold">
                {course.category}
              </Text>
              <View className="mt-2 ">
                <RenderHTML
                  contentWidth={width}
                  source={{ html: course.description }}
                />
              </View>
            </View>
          </View>
          <View className="flex-row justify-between ">
            <View className="pl-4">
              <Text
                className=" text-xl uppercase font-bold"
                style={{
                  color: theme.colors.gray[400],
                }}
              >
                Học phí
              </Text>
              <Text
                className=" text-base font-extrabold"
                style={{
                  color: theme.colors.slate[600],
                }}
              >
                {course.price < 0 ? "Miễn phí" : formatCurrency(course.price)}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: isLoading
                  ? theme.colors.gray[400]
                  : theme.colors.slate[600],
                shadowColor: isLoading
                  ? theme.colors.tabActive
                  : theme.colors.tabInactive,
              }}
              className={`p-4 mr-4 rounded-2xl shadow-lg`}
              onPress={() => handleEnroll(course)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text
                  className=" font-bold text-lg"
                  style={{
                    color: theme.colors.white,
                  }}
                >
                  Đăng ký ngay
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default CourseDetailedScreen;
