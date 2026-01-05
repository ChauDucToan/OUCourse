import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { ScrollView } from "react-native";
import { ImageBackground } from "react-native";
import { Text } from "react-native";
import RenderHTML from "react-native-render-html";
import { Icon } from "react-native-paper";
import HeaderBack from "../../components/HeaderBack";

const CourseDetailedScreen = () => {
  const route = useRoute();
  const [course, setCourse] = useState();
  const [isLoading, setLoading] = useState(false);
  const { id } = route.params;
  const { width } = Dimensions.get("window");

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

  const handleEnroll = async () => {
    try {
      const res = await axiosClient.post(endpoints.enrollCourse);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="bg-white flex-1">
      <ScrollView className="pt-10 bg-white">
        <View className="flex-row items-center mb-3">
          <HeaderBack />
          <View className="flex-1 flex-row items-center  py-1">
            <Text className="text-gray-900 text-2xl leading-tight">
              {course.subject}
            </Text>
          </View>
        </View>
        <View>
          <ImageBackground
            source={{ uri: course.image }}
            className="w-full h-52 rounded-xl"
            style={{ width: width }}
          ></ImageBackground>
          <View className="px-5 -mt-8  pt-8 shadow-2xl">
            <View className="flex-row items-center mt-6  bg-gray-50 rounded-2xl">
              <View className="bg-slate-500 p-2 rounded-full">
                <Icon source="account-tie" size={24} color="white" />
              </View>
              <View className="ml-4">
                <Text className="text-gray-400 text-xs">
                  Giảng viên chuyên môn
                </Text>
                <Text className="text-gray-900 text-lg font-bold">
                  {course.instructor}
                </Text>
              </View>
            </View>
            <View className="mt-8 mb-20">
              <Text className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
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
              <Text className="text-gray-400 text-xl uppercase font-bold">
                Học phí
              </Text>
              <Text className="text-slate-600 text-base font-extrabold">
                {course.price < 0 ? "Miễn phí" : formatCurrency(course.price)}
              </Text>
            </View>

            <TouchableOpacity
              className={`p-4 mr-4 rounded-2xl shadow-lg ${isLoading ? "bg-gray-400" : "bg-slate-600 shadow-blue-300"}`}
              onPress={console.log("handle error")}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-bold text-lg">
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
