import AuthLayout from "../../components/AuthLayout";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { List, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import colors from "tailwindcss/colors";
import { Pressable } from "react-native";
import TextCustom from "../../components/TextCustom";
import { ActivityIndicator } from "react-native";
import { registerApi } from "../../api/registerApi";
const Register = () => {
  const jsonData = require("../../mock/data.config.register.json");
  const fieldsRender = jsonData.info;

  const [user, setUser] = useState({});
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permissions denied!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        setUser({ ...user, avatar: result.assets[0] });
      }
    }
  };

  const validate = () => {
    if (!user.password || user.password !== user.confirm) {
      setErr(true);
      return false;
    }
    setErr(false);
    return true;
  };
  const getMimeType = (fileUri) => {
    // 1. Lấy đuôi file (extension) từ URI (ví dụ: .jpeg, .png)
    const extension = fileUri.split(".").pop().toLowerCase();

    // 2. Check và trả về type chuẩn
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "heic": // Định dạng ảnh của iPhone
        return "image/heic";
      default:
        return "image/jpeg"; // Mặc định an toàn nhất là jpeg
    }
  };
  const register = async () => {
    if (validate() === true) {
      setLoading(true);

      try {
        let form = new FormData();
        for (let key in user)
          if (key !== "confirm") {
            if (key === "avatar") {
              form.append(key, {
                uri: user.avatar.uri,
                name: user.avatar.uri.split("/").pop(),
                type: getMimeType(user.avatar.type),
              });
            } else form.append(key, user[key]);
          }
        console.info(user);
        console.log(form);
        const res = await registerApi.register(form);
        console.log(res.status);
        if (res.status === 201) {
          nav.navigate("Login");
        }
        console.log("DANG KY THANH CONG");
        nav.navigate("Login");
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <AuthLayout title="ĐĂNG KÝ NGƯỜI DÙNG">
      {fieldsRender.map((item) => (
        <TextInput
          key={item.field}
          value={user[item.field]}
          onChangeText={(t) => setUser({ ...user, [item.field]: t })}
          label={item.title}
          secureTextEntry={item.secureTextEntry}
          activeOutlineColor={colors.slate[500]}
          right={<TextInput.Icon icon={item.icon} />}
          mode="outlined"
        />
      ))}
      <TouchableOpacity
        className="border-2 p-2  rounded-md mt-2 border-slate-500"
        onPress={pickImage}
      >
        <TextCustom.TextMuted text="Chọn ảnh đại diện..." />
      </TouchableOpacity>
      {user.avatar && (
        <Image
          source={{ uri: user.avatar.uri }}
          style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10 }}
        />
      )}
      <Pressable
        onPress={register}
        disabled={loading}
        className={`mt-4 p-3 rounded-xl flex-row justify-center items-center shadow-md ${loading ? "bg-slate-400" : "bg-slate-700"} active:bg-slate-800`}
      >
        {loading ? (
          <ActivityIndicator
            animating={true}
            color={colors.white}
            size="small"
          />
        ) : (
          <>
            <List.Icon icon="account" color={colors.white} />
            <Text className="text-white font-bold ml-1 text-base">ĐĂNG KÝ</Text>
          </>
        )}
      </Pressable>
    </AuthLayout>
  );
};
export default Register;
