import HeaderCustom from "../../components/Header";
import { TouchableOpacity, View } from "react-native";
import { useEffect } from "react";
import { Image } from "react-native";
import TextCustom from "../../components/TextCustom";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { ActivityIndicator } from "react-native-paper";
import { useCourses } from "../../hooks/useCourses";
import { useState } from "react";
import { MyUserContext } from "../../utils/contexts/MyContext";
import { Text } from "react-native";

const UserLearning = () => {
  const { courses, ensureCourses, setCourses } = useCourses();
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();
  const [user] = useContext(MyUserContext);
  const { theme } = useContext(MyColorContext);
  useEffect(() => {
    if (!user) {
      setCourses([]);
      return;
    }
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        await ensureCourses("ENROLLED");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [ensureCourses]);

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Vui lòng đăng nhập để xem khóa học.</Text>
      </View>
    );
  }
  return (
    <View
      className="pt-10 flex-1"
      style={{ backgroundColor: theme.colors.gray[100] }}
    >
      <HeaderCustom text="Danh sách bài học của tôi" />
      <View style={{ backgroundColor: theme.colors.slate[300] }}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <FlatList
            data={courses}
            contentContainerStyle={{
              paddingBottom: 52,
            }}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() =>
                  nav.navigate("Lesson", {
                    item: item,
                  })
                }
              >
                <View
                  className="flex-row p-2 items-center border"
                  style={{
                    backgroundColor: theme.colors.slate[200],
                    borderColor: theme.colors.gray[700],
                  }}
                >
                  <View className="mb-2 ml-2">
                    <Image
                      className="w-24 h-24 rounded-xl"
                      source={
                        item.image
                          ? { uri: item.image }
                          : require("../../assets/banner_1.png")
                      }
                    />
                  </View>
                  <View className="justify-end border-b flex-1 m-2 border-gray-200">
                    <TextCustom.TextMuted
                      text={item.category}
                      style={{
                        color: theme.colors.slate[500],
                      }}
                    />
                    <View className="item-start">
                      <TextCustom.TextSection
                        className="text-base  "
                        style={{ color: theme.colors.yellow[500] }}
                        text={item.subject}
                      />
                    </View>
                    <TextCustom.TextFocus
                      text={item.instructor}
                      style={{ color: theme.colors.blue[500] }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default UserLearning;
