import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { Icon } from "react-native-paper";
import colors from "tailwindcss/colors";

const HomePromotion = () => {
  return (
    <View className="px-5 my-6">
      <TouchableOpacity
        activeOpacity={0.9}
        className="overflow-hidden rounded-3xl shadow-lg shadow-orange-200"
      >
        <ImageBackground
          source={{
            uri: "https://img.freepik.com/free-vector/gradient-abstract-background_23-2149131346.jpg",
          }}
          className="p-6 flex-row items-center justify-between"
        >
          <View className="flex-1 pr-4">
            <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-2">
              <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
                Ưu đãi giới hạn
              </Text>
            </View>
            <Text className="text-white text-2xl font-black leading-7 mb-1">
              Gói Hội Viên PRO{"\n"}Giảm ngay 40%
            </Text>
            <Text className="text-white/80 text-xs font-medium">
              Mở khóa toàn bộ +200 khóa học cao cấp và nhận chứng chỉ quốc tế.
            </Text>

            <View className="flex-row items-center mt-4 bg-orange-500 self-start px-4 py-2 rounded-xl">
              <Text className="text-white font-bold mr-2">Nâng cấp ngay</Text>
              <Icon source="arrow-right" size={18} color="white" />
            </View>
          </View>

          <View className="bg-white/10 p-4 rounded-full border border-white/20">
            <Icon source="medal" size={50} color={colors.orange[400]} />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default HomePromotion;
