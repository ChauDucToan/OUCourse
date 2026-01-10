import { TouchableOpacity, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native";
import HeaderCustom from "../../components/Header";
import SelectTime from "../../components/SelectTime";
import TextCustom from "../../components/TextCustom";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

const CourseEditor = () => {
  const { theme } = useContext(MyColorContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
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
          // mode="outlined"
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
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity
          className="border-2 p-2 rounded-md mt-2 border-slate-500"
          onPress={pickImage}
        >
          <TextCustom.TextMuted
            style={{ color: theme.colors.gray[500] }}
            text={image ? "Đã chọn ảnh" : "Chọn ảnh cho khóa học..."}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="border-2 p-2 rounded-md mt-2 border-slate-500"
          onPress={pickVideo}
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
            onPress={() => console.log("Tạo khóa học nè ")}
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
