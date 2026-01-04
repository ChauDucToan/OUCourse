import { Pressable, View } from "react-native";
import { ActivityIndicator, HelperText, TextInput } from "react-native-paper";
import colors from "tailwindcss/colors";
import TextCustom from "../../components/TextCustom";
import AuthLayout from "../../components/AuthLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext } from "react";
import { MyUserContext } from "../../utils/contexts/MyContext";

import { useState } from "react";
import { authApi } from "../../api/authApi";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";

const Login = () => {
  const jsonData = require("../../mock/data.config.register.json");
  const jsonStyle = require("../../mock/data.styles.json");

  const fieldsRender = jsonData.info.filter(
    (item) => item.field === "username" || item.field === "password",
  );
  const [user, setUser] = useState({});
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [, dispatch] = useContext(MyUserContext);

  const validate = () => {
    if (!user.password || !user.username) {
      setErr(true);
      return false;
    }
    setErr(false);
    return true;
  };

  const login = async () => {
    if (validate() === true) {
      setLoading(true);
      try {
        await authApi.login(user);
        let userRes = await axiosClient.get(endpoints["current_user"]);
        dispatch({
          type: "login",
          payload: userRes.data,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthLayout title="ĐĂNG NHẬP NGƯỜI DÙNG">
      <HelperText type="error" visible={err}>
        Mật khẩu KHÔNG khớp!
      </HelperText>
      {fieldsRender.map((item) => (
        <TextInput
          key={item.field}
          label={item.title}
          value={user[item.field]}
          onChangeText={(t) => {
            setUser({ ...user, [item.field]: t });
            setErr(false);
          }}
          secureTextEntry={item.secureTextEntry}
          activeOutlineColor={colors.slate[500]}
          right={<TextInput.Icon icon={item.icon} />}
          mode="outlined"
        />
      ))}
      <View className="flex mb-2 flex-row-reverse gap-5 mt-3">
        <Pressable onPress={login} className={jsonStyle["pressable-focus"]}>
          {loading ? (
            <ActivityIndicator
              animating={true}
              color={colors.white}
              size="small"
            />
          ) : (
            <TextCustom.TextNoFocus text="ĐĂNG NHẬP" />
          )}
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          className={jsonStyle["pressable-no-focus"]}
        >
          <TextCustom.TextFocus text="ĐĂNG KÝ" />
        </Pressable>
      </View>
    </AuthLayout>
  );
};

export default Login;
