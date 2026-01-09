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
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

const UserLearning = () => {
  const [corse, setCourse] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      const res = axiosClient.get(endpoints.courses);
    };
  });
  const nav = useNavigation();
  const { theme } = useContext(MyColorContext);
  return (
    <View
      className="pt-10 flex-1"
      style={{ backgroundColor: theme.colors.gray[100] }}
    >
      <HeaderCustom text="Danh sách bài học của tôi" />
      <View style={{ backgroundColor: theme.colors.slate[300] }}>
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
                    style={{ color: theme.colors.yellow[500] }}
                    text={item.subject}
                  />
                  <TextCustom.TextFocus
                    text={item.instructor}
                    style={{ color: theme.colors.blue[500] }}
                  />
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
