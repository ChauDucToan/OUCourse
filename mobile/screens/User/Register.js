import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import Apis, { endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const info = require("../../mock/data.config.register.json");
  const [user, setUser] = useState({});
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status != "granted") {
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
  const register = async () => {
    if (validate() === true) {
      try {
        setLoading(true);
        let form = new FormData();
        for (let key in user)
          if (key !== "confirm") {
            if (key === "avatar") {
              form.append(key, {
                uri: user.avatar.uri,
                name: user.avatar.fileName,
                type: user.avatar.type || "image/jpeg",
              });
            } else form.append(key, user[key]);
          }
        console.info(user);

        let res = await Apis.post(endpoints["register"], form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 201) {
          nav.navigate("Login");
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <View>
      <Text>ĐĂNG KÝ NGƯỜI DÙNG</Text>
      <ScrollView>
        <HelperText type="error" visible={err}>
          Mật khẩu KHÔNG khớp!
        </HelperText>

        {info.map((i) => (
          <TextInput
            key={i.field}
            value={user[i.field]}
            onChangeText={(t) => setUser({ ...user, [i.field]: t })}
            label={i.title}
            secureTextEntry={i.secureTextEntry}
            right={<TextInput.Icon icon={i.icon} />}
          />
        ))}

        <TouchableOpacity onPress={pickImage}>
          <Text>Chọn ảnh đại diện...</Text>
        </TouchableOpacity>

        {user.avatar && <Image source={{ uri: user.avatar.uri }} />}

        <Button
          loading={loading}
          disabled={loading}
          icon="account"
          mode="contained"
          onPress={register}
        >
          Đăng ký
        </Button>
      </ScrollView>
    </View>
  );
};
export default Register;
