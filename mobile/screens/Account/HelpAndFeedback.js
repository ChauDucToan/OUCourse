import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MessageSquare, Mail, Phone, ChevronDown } from "lucide-react-native";
import HeaderCustom from "../../components/Header";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";

import { faqs } from "../../mock/data.config.faq.json";

const HelpAndFeedbackScreen = ({ navigation }) => {
  const [feedback, setFeedback] = useState("");

  const handleSendFeedback = () => {
    Alert.alert(
      "Thông báo",
      "Cảm ơn bạn đã gửi phản hồi! Chúng tôi sẽ phản hồi sớm nhất có thể.",
    );
    setFeedback("");
  };

  return (
    <ScrollView className="flex-1 bg-white pt-10">
      <HeaderCustom text="Trợ giúp và phản hồi" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-6">
            <Text className="text-gray-900 font-bold text-lg mb-4">
              Câu hỏi thường gặp
            </Text>
            {faqs.map((item) => (
              <FAQItem
                key={item.id}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </View>

          <View className="mt-8">
            <Text className="text-gray-900 font-bold text-lg mb-4">
              Liên hệ trực tiếp
            </Text>
            <View className="flex-row justify-between">
              <ContactCard icon={Phone} label="Hotline" color="text-blue-600" />
              <ContactCard icon={Mail} label="Email" color="text-red-500" />
              <ContactCard
                icon={MessageSquare}
                label="Chat"
                color="text-green-500"
              />
            </View>
          </View>

          <View className="mt-8 mb-10">
            <Text className="text-gray-900 font-bold text-lg mb-2">
              Gửi phản hồi cho chúng tôi
            </Text>
            <Text className="text-gray-500 mb-4 text-sm">
              Ý kiến của bạn giúp chúng tôi hoàn thiện ứng dụng hơn.
            </Text>

            <TextInput
              multiline
              numberOfLines={5}
              placeholder="Nhập nội dung phản hồi của bạn tại đây..."
              className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-800 text-base mb-4 h-32"
              textAlignVertical="top"
              value={feedback}
              onChangeText={setFeedback}
            />

            <TouchableOpacity
              onPress={handleSendFeedback}
              className="bg-slate-600 py-4 rounded-2xl items-center shadow-sm"
            >
              <Text className="text-white font-bold text-base">
                Gửi phản hồi
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
const FAQItem = ({ question, answer }) => (
  <TouchableOpacity className="border-b border-gray-100 py-4 flex-row justify-between items-center">
    <View className="flex-1 pr-4">
      <Text className="text-gray-800 font-medium text-base mb-1">
        {question}
      </Text>
      <Text className="text-gray-500 text-sm leading-5">{answer}</Text>
    </View>
    <ChevronDown size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

const ContactCard = ({ icon: Icon, label, color }) => (
  <TouchableOpacity className="bg-gray-50 items-center justify-center py-4 rounded-2xl w-[30%] border border-gray-100">
    <Icon size={24} className={color} />
    <Text className="text-gray-700 mt-2 font-medium">{label}</Text>
  </TouchableOpacity>
);
export default HelpAndFeedbackScreen;
