import { useRoute, useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import HeaderCustom from "../../components/Header";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import TextCustom from "../../components/TextCustom";
import { pickImage, pickVideo } from "../../utils/imageUtils";

const EditMyCourse = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { course, theme } = route.params;

  const [subject, setSubject] = useState(course.subject);
  const [price, setPrice] = useState(String(course.price));
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateCourse = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("price", Number(price));
      if (image) {
        formData.append("image", {
          uri: image.uri,
          type: "image/jpeg",
          name: "course.jpg",
        });
      }
      if (video) {
        formData.append("video", {
          uri: video.uri,
          type: "video/mp4",
          name: "course.mp4",
        });
      }

      await axiosClient.patch(endpoints.courseDetails(course.id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigation.goBack();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="pt-10">
      <HeaderCustom />
      <TextCustom.TextSection
        className="text-2xl text-center"
        text={"Chỉnh sửa khóa học"}
        style={{ color: theme.colors.slate[400] }}
      />
      <View
        className="p-5 gap-4 rounded-xl m-5"
        style={{ backgroundColor: theme.colors.slate[200] }}
      >
        <TextInput
          mode="outlined"
          label="Tên khóa học"
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          mode="outlined"
          label="Giá khóa học"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TouchableOpacity
          className="border p-2 rounded-md"
          onPress={async () => {
            const img = await pickImage();
            if (img) setImage(img);
          }}
        >
          <Button>{image ? "Đã chọn ảnh" : "Chọn ảnh khóa học"}</Button>
        </TouchableOpacity>

        <TouchableOpacity
          className="border p-2 rounded-md"
          onPress={async () => {
            const video = await pickVideo();
            if (video) setVideo(video);
          }}
        >
          <Button>{video ? "Đã chọn video" : "Chọn video khóa học"}</Button>
        </TouchableOpacity>

        <Button
          mode="contained"
          onPress={handleUpdateCourse}
          labelStyle={{ color: theme.colors.slate[400] }}
          loading={loading}
        >
          Xác nhận chỉnh sửa
        </Button>
      </View>
    </View>
  );
};

export default EditMyCourse;
