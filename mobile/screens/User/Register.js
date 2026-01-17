import AuthLayout from "../../components/AuthLayout";
import { Image, Text, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";

import TextCustom from "../../components/TextCustom";
import { ActivityIndicator } from "react-native";

import { registerApi } from "../../api/registerApi";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import FormAuth from "../../components/FormAuth";
import { Alert } from "react-native";
import { getMimeType, pickImage } from "../../utils/imageUtils";
import { useColors } from "../../hooks/useColors";
import { errorConsole } from "../../utils/errorUtils";
import { Picker } from "@react-native-picker/picker";

const Register = () => {
  const jsonData = require("../../mock/data.config.register.json");
  const fieldsRender = jsonData.info;
  const { theme } = useColors();
  const [err, setErr] = useState(false);
  const [user, setUser] = useState({});
  const [selectRole, setSelectRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  const validate = () => {
    console.info(user);
    if (!user.username) {
      setErr(true);
      Alert.alert("Chưa có tài khoản!");
      return false;
    }
    if (user.password !== user.confirm) {
      setErr(true);
      Alert.alert("Mật khẩu khác với mật khẩu xác nhận!");
      return false;
    }
    if (!user.password) {
      Alert.alert("Chưa nhập mật khẩu");

      setErr(true);
      return false;
    }
    setErr(false);
    return true;
  };

  const register = async () => {
    console.log(validate());
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
        form.append("role", selectRole);
        console.log("ROLLE", selectRole);
        const res = await registerApi.register(form);

        if (res.status === 201) {
          alert("Đăng ký thành công!");
          console.log("FORM ", form);
          nav.navigate("Login");
        }
      } catch (error) {
        errorConsole(error, "Register:register");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <AuthLayout title="ĐĂNG KÝ NGƯỜI DÙNG">
      {fieldsRender.map((item) => (
        <FormAuth
          key={item.field}
          item={item}
          theme={theme}
          value={user[item.field] || ""}
          onChangeText={(t) => setUser({ ...user, [item.field]: t })}
        />
      ))}
      <Picker
        selectedValue={selectRole}
        onValueChange={(itemValue) => setSelectRole(itemValue)}
        style={{
          backgroundColor: theme.colors.slate[400],
          color: theme.textMuted,
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        <Picker.Item key="INSTRUCTOR" label="Giảng Viên" value="INSTRUCTOR" />
        <Picker.Item key="STUDENT" label="Học sinh" value="STUDENT" />
      </Picker>
      <TouchableOpacity
        className="border-2 p-2  rounded-md mt-2 border-slate-500"
        onPress={async () => {
          const img = await pickImage();
          if (img) setUser({ ...user, avatar: img });
        }}
      >
        <TextCustom.TextMuted
          style={{ color: theme.colors.slate[400] }}
          text="Chọn ảnh đại diện..."
        />
      </TouchableOpacity>
      {user.avatar && (
        <Image
          source={{ uri: user.avatar.uri }}
          style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10 }}
        />
      )}
      <TouchableOpacity
        onPress={register}
        disabled={loading}
        className="mt-4 p-3 rounded-xl flex-row justify-center items-center shadow-md"
        style={{
          backgroundColor: loading
            ? theme.colors.slate[400]
            : theme.colors.slate[700],
        }}
      >
        {loading ? (
          <ActivityIndicator
            animating={true}
            color={theme.colors.white}
            size="small"
          />
        ) : (
          <>
            <List.Icon icon="account" color={theme.colors.white} />
            <Text
              className="font-bold ml-1 text-base"
              style={{
                color: theme.colors.white,
              }}
            >
              ĐĂNG KÝ
            </Text>
          </>
        )}
      </TouchableOpacity>
    </AuthLayout>
  );
};
export default Register;
