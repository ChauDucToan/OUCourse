import { useRoute } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import HeaderCustom from "../../components/Header";
import TextCustom from "../../components/TextCustom";
import { ScrollView } from "react-native";

import { TextInput } from "react-native";

import { ActivityIndicator } from "react-native-paper";

const extractVideoId = (url) => {
  if (!url) return null;

  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(regExp);
  return match ? match[1] : null;
};

const LessonLearning = () => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);
  const route = useRoute();
  const [comments, setComments] = useState([]); // Quản lý danh sách bình luận
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { lesson, theme } = route.params;
  const videoId = extractVideoId(lesson.video);
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Hoàn thành bài học");
    }
  }, []);

  if (!videoId) {
    return (
      <View className="flex-1 justify-center items-center">
        <TextCustom.TextSection
          style={{ color: theme.colors.slate[800] }}
          text="URL Video không hợp lệ"
        />
      </View>
    );
  }

  return (
    <View className="pt-10" style={{ backgroundColor: theme.colors.gray[100] }}>
      <HeaderCustom />
      {lesson.video !== null ? (
        <YoutubePlayer
          ref={playerRef}
          height={220}
          className="mb-0 pb-0"
          play={playing}
          videoId={videoId}
          onChangeState={onStateChange}
        />
      ) : (
        <TextCustom.TextSection
          text="KHông có video"
          style={{ color: theme.colors.slate[800] }}
        />
      )}

      <ScrollView>
        <TextCustom.TextFocus
          style={{ color: theme.colors.slate[600] }}
          className="pl-4 text-xl"
          text={lesson.subject}
        />
        <View className="flex-row gap-3">
          {lesson.tags.map((tag) => (
            <View
              key={tag.id}
              className=" p-3 rounded-xl m-2"
              style={{ backgroundColor: theme.colors.slate[200] }}
            >
              <TextCustom.TextFocus
                style={{
                  color: theme.colors.slate[600],
                }}
                text={tag}
              />
            </View>
          ))}
        </View>
        <View className="mt-6 mb-10 p-3">
          <TextCustom.TextFocus
            style={{ color: theme.colors.slate[600] }}
            className="text-lg font-bold mb-4"
            text="Bình luận"
          />

          <View className="flex-row items-center mb-6 ">
            <TextInput
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2 bg-gray-50"
              placeholder="Viết bình luận..."
              value={content}
              onChangeText={setContent}
              multiline
            />
            <TouchableOpacity
              className="bg-blue-500 px-4 py-2 rounded-lg"
              onPress={() => setContent("")}
              disabled={loading || !content.trim()}
              style={{ opacity: loading || !content.trim() ? 0.6 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <TextCustom.TextFocus
                  style={{ color: theme.colors.slate[600] }}
                  className="text-white"
                  text="Gửi"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LessonLearning;
