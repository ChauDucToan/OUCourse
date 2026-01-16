import { useRoute } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import HeaderCustom from "../../components/Header";
import TextCustom from "../../components/TextCustom";
import { ScrollView } from "react-native";

import { TextInput } from "react-native";

import { ActivityIndicator } from "react-native-paper";
import { useContext } from "react";
import { LessonContext } from "../../utils/contexts/LessonContext";
import { useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { useUser } from "../../hooks/useUser";
import { errorConsole } from "../../utils/errorUtils";
import Comments from "../../components/Comments";

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
  const [content, setContent] = useState("");
  const [videoId, setVideoId] = useState();
  const [user] = useUser();
  const { id, theme } = route.params;
  const { ensureLessonDetailed, loading, lesson } = useContext(LessonContext);
  useEffect(() => {
    const loadData = async () => {
      const data = await ensureLessonDetailed(id);
      if (data && data.video_url) {
        setVideoId(extractVideoId(data.video_url));
      }
    };

    loadData();
  }, [id, ensureLessonDetailed]);
  const onStateChange = useCallback(async (state) => {
    if (state === "ended") {
      setPlaying(false);
      try {
        const formData = new FormData();
        formData.append("status", "COMPLETED");
        const res = await axiosClient.patch(
          endpoints["lessonLearning"](id),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        console.log("RES", res);
        if (res.status === 200) {
          alert("Hoàn thành bài học");
        }
      } catch (error) {
        errorConsole(error, "LessonLearning:onStageChange");
      }
    }
  }, []);
  if (loading || !lesson || !lesson.subject) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      className="pt-10 flex-1"
      style={{ backgroundColor: theme.colors.gray[200] }}
    >
      <HeaderCustom />
      {videoId && lesson.video_url !== null ? (
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
          text="Không có video"
          className="p-4"
          style={{ color: theme.colors.slate[800] }}
        />
      )}

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 6,
        }}
      >
        <TextCustom.TextFocus
          style={{ color: theme.colors.slate[600] }}
          className="pl-4 text-xl"
          text={lesson.subject}
        />
        {lesson?.tags?.length > 0 && (
          <View className="flex-row gap-3">
            {lesson?.tags.map((tag, index) => (
              <View
                key={tag.id ?? index}
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
        )}

        <TextCustom.TextFocus
          style={{ color: theme.colors.slate[600] }}
          className="pl-4 text-xl"
          text={lesson.content}
        />
        <View>
          <Comments lessonId={lesson.id} theme={theme} user={user} />
        </View>
      </ScrollView>
    </View>
  );
};

export default LessonLearning;
