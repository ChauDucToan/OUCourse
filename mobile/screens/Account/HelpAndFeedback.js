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
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

const HelpAndFeedbackScreen = ({ navigation }) => {
  const [feedback, setFeedback] = useState("");
  const { theme } = useContext(MyColorContext);
  const handleSendFeedback = () => {
    Alert.alert(
      "Thông báo",
      "Cảm ơn bạn đã gửi phản hồi! Chúng tôi sẽ phản hồi sớm nhất có thể.",
    );
    setFeedback("");
  };

  return (
    <ScrollView
      className="flex-1 pt-10"
      style={{
        backgroundColor: theme.colors.white,
      }}
    >
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
            <Text
              className=" font-bold text-lg mb-4"
              style={{
                color: theme.colors.gray[900],
              }}
            >
              Câu hỏi thường gặp
            </Text>
            {faqs.map((item) => (
              <FAQItem
                key={item.id}
                question={item.question}
                answer={item.answer}
                theme={theme}
              />
            ))}
          </View>

          <View className="mt-8">
            <Text
              className=" font-bold text-lg mb-4"
              style={{
                color: theme.colors.gray[900],
              }}
            >
              Liên hệ trực tiếp
            </Text>
            <View className="flex-row justify-between">
              <ContactCard
                theme={theme}
                icon={Phone}
                label="Hotline"
                color={theme.colors.blue[500]}
              />
              <ContactCard
                theme={theme}
                icon={Mail}
                label="Email"
                color={theme.colors.danger}
              />
              <ContactCard
                theme={theme}
                icon={MessageSquare}
                label="Chat"
                color={theme.colors.green[500]}
              />
            </View>
          </View>

          <View className="mt-8 mb-10">
            <Text
              className="text-gray-900 font-bold text-lg mb-2"
              style={{
                color: theme.colors.gray[900],
              }}
            >
              Gửi phản hồi cho chúng tôi
            </Text>
            <Text className="text-gray-500 mb-4 text-sm">
              Ý kiến của bạn giúp chúng tôi hoàn thiện ứng dụng hơn.
            </Text>

            <TextInput
              multiline
              numberOfLines={5}
              placeholder="Nhập nội dung phản hồi của bạn tại đây..."
              className="border  rounded-2xl p-4 text-base mb-4 h-32"
              style={{
                backgroundColor: theme.colors.gray[50],
                borderColor: theme.colors.gray[200],
                color: theme.colors.gray[800],
              }}
              textAlignVertical="top"
              value={feedback}
              onChangeText={setFeedback}
            />

            <TouchableOpacity
              onPress={handleSendFeedback}
              className=" py-4 rounded-2xl items-center shadow-sm"
              style={{
                backgroundColor: theme.colors.slate[600],
              }}
            >
              <Text
                className=" font-bold text-base"
                style={{
                  color: theme.colors.white,
                }}
              >
                Gửi phản hồi
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
const FAQItem = ({ question, answer, theme }) => (
  <TouchableOpacity className="border-b border-gray-100 py-4 flex-row justify-between items-center">
    <View className="flex-1 pr-4">
      <Text
        className="text-gray-800 font-medium text-base mb-1"
        style={{
          color: theme.colors.gray[800],
        }}
      >
        {question}
      </Text>
      <Text
        className="text-sm leading-5"
        style={{
          color: theme.colors.gray[500],
        }}
      >
        {answer}
      </Text>
    </View>
    <ChevronDown size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

const ContactCard = ({ icon: Icon, label, color, theme }) => (
  <TouchableOpacity
    style={{
      backgroundColor: theme.colors.gray[50],
      borderColor: theme.colors.gray[100],
    }}
    className="items-center justify-center py-4 rounded-2xl w-[30%] border "
  >
    <Icon size={24} color={color} />
    <Text
      className=" mt-2 font-medium"
      style={{
        color: theme.colors.gray[700],
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
export default HelpAndFeedbackScreen;
