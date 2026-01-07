import HeaderCustom from "../../components/Header";
import { TouchableOpacity, View } from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { Image } from "react-native";

import { results } from "../../mock/data.mock.courses.json";
import TextCustom from "../../components/TextCustom";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

const UserLearning = () => {
  const [corse, setCourse] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      const res = axiosClient.get(endpoints.courses);
    };
  });
  const nav = useNavigation();
  return (
    <View className="bg-slate-50 pt-10 flex-1">
      <HeaderCustom text="Danh sách bài học của tôi" />
      <View className="bg-white">
        <FlatList
          data={results}
          contentContainerStyle={{
            paddingBottom: 52,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              delayPressIn={0.6}
              activeOpacity={0.6}
              onPress={() => nav.navigate("Lesson", { item: item })}
            >
              <View className="flex-row">
                <View>
                  <Image className="w-24 h-24" source={{ uri: item.image }} />
                </View>
                <View className="justify-end border-b w-full m-2 border-gray-200">
                  <TextCustom.TextMuted text={item.category} />
                  <TextCustom.TextSection
                    className="text-xl"
                    text={item.subject}
                  />
                  <TextCustom.TextFocus text={item.instructor} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default UserLearning;
