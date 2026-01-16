import { TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-paper";
import { ActivityIndicator } from "react-native";
import HeaderCustom from "../../components/Header";
import SelectTime from "../../components/SelectTime";
import TextCustom from "../../components/TextCustom";
import { getMimeType, pickImage, pickVideo } from "../../utils/imageUtils";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCategories } from "../../hooks/useCategories";
import { useColors } from "../../hooks/useColors";
import { errorConsole } from "../../utils/errorUtils";
import { useCourses } from "../../hooks/useCourses";

const CourseEditor = () => {
  const { theme } = useColors();
  const nav = useNavigation();
  const { categories } = useCategories();
  const { addNewCourse } = useCourses();
  const [selectedCategory, setSelectedCategory] = useState("");

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const validatePrice = (price) => {
    if (!price) return false;
    return /^\d+([.,]\d+)?$/.test(price);
  };
  const isFormValid =
    subject.trim() !== "" &&
    Number.isInteger(selectedCategory) &&
    selectedCategory > 0 &&
    validatePrice(price);
  const createCourse = async () => {
    if (!subject || !selectedCategory || !price) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập tên, giá và chọn danh mục.",
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("subject", subject);
      formData.append("description", description || "Chưa có mô tả");
      formData.append("price", price);
      formData.append("category", parseInt(selectedCategory));

      const totalDuration = parseInt(hour) * 60 + parseInt(minute);
      formData.append("duration", totalDuration);

      if (image) {
        formData.append("image", {
          uri: image.uri,
          name: image.fileName || `course_img_${Date.now()}.jpg`,
          type: getMimeType(image.uri),
        });
      }

      if (video) {
        formData.append("video", {
          uri: video.uri,
          name: video.fileName || `course_vid_${Date.now()}.mp4`,
          type: getMimeType(video.uri),
        });
      }

      console.log("FormData chuẩn bị gửi:", formData);

      const res = await axiosClient.post(endpoints.courses, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        Alert.alert("Thành công", "Tạo khóa học thành công!");
        const course = res.data;
        addNewCourse(course);
        nav.goBack();
      }
    } catch (error) {
      errorConsole(error, "CourseEditor:createCourse");

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data lỗi:", error.response.data);
        console.log("Headers:", error.response.headers);
        Alert.alert("Lỗi", JSON.stringify(error.response.data));
      } else if (error.request) {
        console.log("Request object:", error.request);
        Alert.alert("Lỗi", "Không nhận được phản hồi từ server.");
      } else {
        console.log("Message:", error.message);
        Alert.alert("Lỗi", error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <View
      className="pt-10 flex-1 "
      style={{ backgroundColor: theme.colors.gray[100] }}
    >
      <HeaderCustom />
      <TextCustom.TextSection
        className="text-2xl text-center"
        text={"Tạo mới khóa học"}
        style={{ color: theme.colors.slate[400] }}
      />
      <View
        className="p-4 m-6 rounded-xl"
        style={{ backgroundColor: theme.colors.slate[200] }}
      >
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
          placeholder="Nhập tên khóa học"
          underlineColor="transparent"
          value={subject}
          onChangeText={setSubject}
          activeOutlineColor={theme.colors.gray[100]}
          outlineColor={theme.colors.slate[100]}
        />
        <View className="h-4"></View>
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
          placeholder="Mô tả khóa học"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={3}
          underlineColor="transparent"
          activeOutlineColor={theme.colors.gray[100]}
          outlineColor={theme.colors.slate[100]}
        />
        <View className="h-4"></View>
        <TextInput
          label="Giá khóa học (VNĐ)"
          value={price}
          keyboardType="numeric"
          onChangeText={(v) => {
            setPrice(v);
            setPriceError(false);
          }}
          underlineColor="transparent"
          activeOutlineColor={theme.textMuted}
          onBlur={() => setPriceError(!validatePrice(price))}
          error={priceError}
          className="flex-1 border  border-gray-300 rounded-lg p-2 bg-white"
        />

        <SelectTime
          theme={theme}
          hour={hour}
          setHour={setHour}
          minute={minute}
          setMinute={setMinute}
        />
        <View className="rounded-xl">
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={{
              backgroundColor: theme.colors.slate[400],
              color: theme.textMuted,
              marginTop: 4,
              marginBottom: 4,
            }}
          >
            <Picker.Item label="Chọn danh mục" value="" />
            {categories?.map((item) => (
              <Picker.Item
                key={item.id?.toString() ?? item.value}
                label={item.name}
                value={item.id}
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          className="border-2 p-2 rounded-md mt-2 border-slate-500"
          onPress={async () => {
            const img = await pickImage();
            if (img) setImage(img);
          }}
        >
          <TextCustom.TextMuted
            style={{ color: theme.colors.gray[500] }}
            text={image ? "Đã chọn ảnh" : "Chọn ảnh cho khóa học..."}
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
            text={video ? "Đã chọn video" : "Chọn video cho khóa học..."}
          />
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            className=" p-4  mt-4 text-center rounded-xl"
            style={{
              backgroundColor: theme.colors.slate[300],
            }}
            onPress={createCourse}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <TextCustom.TextFocus
                className="text-center"
                style={{ color: theme.colors.slate[600] }}
                text="Tạo khóa học"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CourseEditor;
