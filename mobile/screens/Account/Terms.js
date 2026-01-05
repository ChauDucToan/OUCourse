import { View, Text, ScrollView } from "react-native";

import HeaderCustom from "../../components/Header";
import { terms } from "../../mock/data.config.terms.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { Section } from "../../components/Section";

const TermsScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 pt-10">
      <HeaderCustom text="Điều khoản & quy định" />
      <ScrollView
        className="flex-1 px-5 bg-white"
        showsVerticalScrollIndicator={false}
      >
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
