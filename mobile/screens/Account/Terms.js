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
import { terms } from "../../mock/data.config.terms.json";
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
          {terms.map((item) => (
            <Section key={item.id} title={item.title} content={item.content} />
          ))}

          <View className="h-10" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;
