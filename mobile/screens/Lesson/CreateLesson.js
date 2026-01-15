import { TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { useMemo, useState } from "react";
import { TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

import HeaderCustom from "../../components/Header";
import TextCustom from "../../components/TextCustom";
import { getMimeType, pickImage, pickVideo } from "../../utils/imageUtils";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { useColors } from "../../hooks/useColors";

const CreateLesson = () => {
  const { theme } = useColors();
  const nav = useNavigation();
  const route = useRoute();
  const courseId = route.params?.courseId;

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [order, setOrder] = useState("0");
  const [isLoading, setLoading] = useState(false);

  const isFormValid = useMemo(() => {
    return !!courseId && subject.trim() !== "" && content.trim() !== "";
  }, [courseId, subject, content]);
  console.log(courseId);
  const handleCreateLesson = async () => {
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("content", content);
      formData.append("course", courseId);

      if (video) {
        formData.append("video", {
          uri: video.uri,
          name: video.fileName || `lesson_vid_${Date.now()}.mp4`,
          type: getMimeType(video.uri),
        });
      }

      if (image) {
        formData.append("image", {
          uri: image.uri,
          name: image.fileName || `course_img_${Date.now()}.jpg`,
          type: getMimeType(image.uri),
        });
      }

      formData.append("order", parseInt(order) ?? 0);
      console.log(formData);
      const res = await axiosClient.post(endpoints.createLesson, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        alert("Tạo bài học thành công!");
        nav.goBack();
      }
    } catch (error) {
      console.error("CreateLesson error:", error);
      alert("Có lỗi khi tạo bài học");
    }
  };
  const createLesson = async () => {
    if (!courseId) {
      Alert.alert("Không tìm thấy courseId.");
      return;
    }
    if (!subject.trim() || !content.trim()) {
      Alert.alert("Vui lòng nhập tiêu đề và nội dung bài học.");
      return;
    }

    setLoading(true);
    handleCreateLesson();
  };

  return (
    <View className="pt-10 flex-1">
      <HeaderCustom />

      <View className=" m-6 rounded-xl justify-center align-middle flex-1">
        <TextCustom.TextSection
          className="text-2xl text-center mb-4"
          text={"Tạo bài học mới"}
          style={{ color: theme.colors.slate[400] }}
        />
        <View
          className="p-6 rounded-xl"
          style={{ backgroundColor: theme.colors.slate[200] }}
        >
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
            placeholder="Nhập tiêu đề bài học (subject)"
            underlineColor="transparent"
            value={subject}
            onChangeText={setSubject}
            activeOutlineColor={theme.colors.gray[100]}
            outlineColor={theme.colors.slate[100]}
          />
          <View className="h-4" />
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
            placeholder="Nhập nội dung bài học (content)"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={5}
            underlineColor="transparent"
            activeOutlineColor={theme.colors.gray[100]}
            outlineColor={theme.colors.slate[100]}
          />
          <View className="h-4" />

          <TextInput
            placeholder="Thứ tự bài học (order)"
            value={order}
            onChangeText={setOrder}
            keyboardType="numeric"
            className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
          />
          <View className="h-4" />

          {/* Image */}
          <TouchableOpacity
            className="border-2 p-2 rounded-md mt-2 border-slate-500"
            onPress={async () => {
              const img = await pickImage();
              if (img) setImage(img);
            }}
          >
            <TextCustom.TextMuted
              style={{ color: theme.colors.gray[500] }}
              text={image ? "Đã chọn ảnh (image)" : "Chọn ảnh cho bài học..."}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="border-2 p-2 rounded-md mt-2 border-slate-500"
            onPress={async () => {
              const video = await pickVideo();
              if (video) setVideo(video);
            }}
          >
            <TextCustom.TextMuted
              style={{ color: theme.colors.gray[500] }}
              text={
                video ? "Đã chọn video (video)" : "Chọn video cho bài học..."
              }
            />
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              className="p-4 mt-4 text-center rounded-xl"
              style={{ backgroundColor: theme.colors.slate[300] }}
              onPress={createLesson}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <ActivityIndicator size="large" />
              ) : (
                <TextCustom.TextFocus
                  className="text-center"
                  style={{ color: theme.colors.slate[600] }}
                  text="Tạo bài học"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CreateLesson;
