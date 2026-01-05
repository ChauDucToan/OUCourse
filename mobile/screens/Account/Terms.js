import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { styled } from "nativewind";
import HeaderBack from "../../components/HeaderBack";
import HeaderCustom from "../../components/Header";

// Tạo component Section để tái sử dụng
const Section = ({ title, content }) => (
  <View className="mb-6">
    <Text className="text-gray-900 font-bold text-lg mb-2">{title}</Text>
    <Text className="text-gray-600 text-base leading-6 text-justify">
      {content}
    </Text>
  </View>
);

const TermsScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      <HeaderCustom text="Điều khoản & quy định" />
      {/* Content */}
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          <Text className="text-gray-400 text-sm mb-6 italic">
            Cập nhật lần cuối: 05 tháng 01, 2026
          </Text>

          <Section
            title="1. Quy định chung"
            content="Bằng cách truy cập và sử dụng ứng dụng, bạn đồng ý ràng buộc bởi các điều khoản này. Chúng tôi cung cấp nền tảng học tập trực tuyến và các công cụ hỗ trợ giáo dục."
          />

          <Section
            title="2. Quyền và Trách nhiệm"
            content="Người dùng có trách nhiệm bảo mật thông tin đăng nhập cá nhân. Mọi hành vi chia sẻ tài khoản cho nhiều người dùng chung sẽ bị khóa tài khoản mà không cần báo trước."
          />

          <Section
            title="3. Chính sách Nội dung"
            content="Tất cả bài giảng, tài liệu video và hình ảnh trên hệ thống thuộc bản quyền sở hữu trí tuệ của chúng tôi. Bạn không được phép sao chép hoặc phát tán dưới mọi hình thức."
          />

          <Section
            title="4. Bảo mật thông tin"
            content="Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn theo tiêu chuẩn an toàn cao nhất. Thông tin của bạn chỉ được dùng để cải thiện trải nghiệm học tập."
          />

          <Section
            title="5. Thay đổi điều khoản"
            content="Chúng tôi có quyền sửa đổi nội dung điều khoản này để phù hợp với quy định pháp luật. Thông báo sẽ được gửi qua ứng dụng khi có thay đổi quan trọng."
          />

          {/* Khoảng trống dưới cùng để không bị che bởi tabbar hoặc nút */}
          <View className="h-10" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;
