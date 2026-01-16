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

import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Linking } from "react-native";
import PaymentSelectionModal from "../../components/ModalPayment";
import { useColors } from "../../hooks/useColors";
import { useCourses } from "../../hooks/useCourses";
import { WebView } from "react-native-webview";
import { Modal } from "react-native";
import { errorConsole } from "../../utils/errorUtils";
import TextCustom from "../../components/TextCustom";

const CourseDetailedScreen = () => {
  const route = useRoute();
  const [course, setCourse] = useState();
  const [isLoading, setLoading] = useState(false);
  const { theme } = useColors();
  const { id } = route.params;
  const { width } = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);
  const [webVisible, setWebVisible] = useState(false);
  // const [isPayment, setIsPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const nav = useNavigation();
  useEffect(() => {
    const loadData = async () => {
      try {
        const params = `${endpoints.courses}${id}/`;
        let res = await axiosClient.get(params);

        setCourse(res.data);
      } catch (error) {
        errorConsole(error, "CourseDetailedScreen:loadData");
      }
    };
    if (id) loadData();
  }, [id]);

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
  const processEnroll = async (courseId) => {
    try {
      const formData = new FormData();
      formData.append("status", "ENROLLED");

      await axiosClient.post(endpoints.enrollCourse(courseId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Đăng ký thành công");
    } catch (error) {
      errorConsole(error, "CourseDetailedScreen:processEnroll");
    }
  };
  const handleEnroll = async (course) => {
    if (Number(course.price) === 0) {
      setModalVisible(false);
      processEnroll(course.id);
      nav.goBack();
      return;
    }
    setModalVisible(true);
  };

  const handlePayment = async (method) => {
    try {
      setLoading(true);

      const paymentPayload = {
        currency: "vnd",
        provider: method.id,
        items: [{ course: course.id }],
      };
      const paymentRes = await axiosClient.post(
        endpoints.payment,
        paymentPayload,
      );
      if (paymentRes.data && paymentRes.data.payment_url) {
        setPaymentUrl(paymentRes.data.payment_url);
        setWebVisible(true);
        console.log("MO WEB");
      } else {
        alert("Thanh toán thất bại");
      }
    } catch (error) {
      errorConsole(error, "CourseDetailedScreen:handlePayment");
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };
  const stunAndGetStatus = (request) => {
    const { url } = request;
    if (url.includes("/api/payments/confirm/") || url.includes("status=1")) {
      setWebVisible(false);

      processEnroll(course.id);
      nav.goBack();
      return false;
    }

    return true;
  };
  return (
    <View
      className=" flex-1"
      style={{
        backgroundColor: theme.colors.gray[100],
      }}
    >
      <ScrollView
        className="pt-10 "
        style={{
          backgroundColor: theme.colors.gray[100],
        }}
      >
        <HeaderCustom targetScreen="SearchScreen" text={course.subject} />
        <View>
          <ImageBackground
            source={
              course.image
                ? { uri: course.image }
                : require("../../assets/banner_1.png")
            }
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
              <Text
                className="text-xs uppercase  tracking-tight font-semibold"
                style={{
                  color: theme.colors.slate[400],
                }}
              >
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
            <PaymentSelectionModal
              isVisible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSelect={(method) => handlePayment(method)}
            />

            <Modal visible={webVisible} animationType="slide">
              <View className="flex-1 pt-10 bg-white">
                <TouchableOpacity
                  onPress={() => setWebVisible(false)}
                  className="p-4 items-end"
                >
                  <TextCustom.TextMuted text="Đóng" />
                </TouchableOpacity>

                <WebView
                  source={{ uri: paymentUrl }}
                  userAgent="Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
                  onShouldStartLoadWithRequest={stunAndGetStatus}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <ActivityIndicator size="large" className="mt-10" />
                  )}
                />
              </View>
            </Modal>

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
