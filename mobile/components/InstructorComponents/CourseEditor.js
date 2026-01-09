import { TouchableOpacity, View } from "react-native";
import HeaderCustom from "../Header";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { useContext, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import TextCustom from "../TextCustom";
import { ActivityIndicator } from "react-native";

const SelectTime = ({ theme }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  return (
    <View className="flex-row gap-3 mt-3">
      <View className="flex-1">
        <Picker
          selectedValue={hour}
          onValueChange={(v) => setHour(v)}
          style={{
            backgroundColor: theme.colors.slate[200],
            color: theme.colors.slate[400],
          }}
        >
          {hours.map((h) => (
            <Picker.Item key={h} label={`${h} giờ`} value={h} />
          ))}
        </Picker>
      </View>

      <View className="flex-1">
        <Picker
          selectedValue={minute}
          onValueChange={(v) => setMinute(v)}
          style={{
            backgroundColor: theme.colors.slate[200],
            color: theme.colors.slate[400],
          }}
        >
          {minutes.map((m) => (
            <Picker.Item key={m} label={`${m} phút`} value={m} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const CourseEditor = () => {
  const { theme } = useContext(MyColorContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState(false);

  useEffect(() => {
    const data = require("../../mock/data.mock.categories.json");
    setCategories(data);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return alert("Permissions denied!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) setImage(result.assets[0]);
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return alert("Permissions denied!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) setVideo(result.assets[0]);
  };

  const validatePrice = (price) => {
    if (!price) return false;
    return /^\d+([.,]\d+)?$/.test(price);
  };

  return (
    <View
      className="pt-10 flex-1"
      style={{ backgroundColor: theme.colors.gray[100] }}
    >
      <HeaderCustom text={"Tạo mới khóa học"} />

      <View>
        <TextInput placeholder="Nhập tên khóa học" />

        <TextInput
          label="Giá khóa học (VNĐ)"
          value={price}
          onChangeText={(v) => {
            setPrice(v);
            setPriceError(false);
          }}
          onBlur={() => setPriceError(!validatePrice(price))}
          error={priceError}
        />

        <SelectTime theme={theme} />

        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={{
            backgroundColor: theme.colors.slate[200],
            color: theme.colors.slate[400],
          }}
        >
          <Picker.Item label="Chọn danh mục" value="" />
          {categories?.map((item) => (
            <Picker.Item
              key={item.id?.toString() ?? item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>

        <TouchableOpacity
          className="border-2 p-2 rounded-md mt-2 border-slate-500"
          onPress={pickImage}
        >
          <TextCustom.TextMuted
            text={image ? "Đã chọn ảnh" : "Chọn ảnh cho khóa học..."}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="border-2 p-2 rounded-md mt-2 border-slate-500"
          onPress={pickVideo}
        >
          <TextCustom.TextMuted
            text={video ? "Đã chọn video" : "Chọn video cho khóa học..."}
          />
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            className=" p-4  mt-4 text-center"
            style={{
              backgroundColor: theme.colors.slate[400],
            }}
            onPress={() => console.log("Tạo khóa học nè")}
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
