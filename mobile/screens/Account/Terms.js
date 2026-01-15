import { View, Text, ScrollView } from "react-native";

import HeaderCustom from "../../components/Header";
import { terms } from "../../mock/data.config.terms.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { Section } from "../../components/Section";
import { useColors } from "../../hooks/useColors";

const TermsScreen = ({ navigation }) => {
  const { theme } = useColors();
  return (
    <SafeAreaView
      className="flex-1 pt-10"
      style={{
        backgroundColor: theme.colors.gray[100],
      }}
    >
      <HeaderCustom text="Điều khoản & quy định" />
      <ScrollView
        className="flex-1 px-5"
        style={{
          backgroundColor: theme.colors.slate[100],
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="py-6">
          <Text
            className=" text-sm mb-6 italic"
            style={{
              color: theme.colors.gray[400],
            }}
          >
            Cập nhật lần cuối: 05 tháng 01, 2026
          </Text>
          {terms.map((item) => (
            <Section
              key={item.id}
              theme={theme}
              title={item.title}
              content={item.content}
            />
          ))}

          <View className="h-10" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;
