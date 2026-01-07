import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();
import { Pressable, View } from "react-native";
import {
  ActivityIndicator,
  HelperText,
  IconButton,
  TextInput,
} from "react-native-paper";
import { MyUserContext } from "../../utils/contexts/MyContext";
import TextCustom from "../../components/TextCustom";
import AuthLayout from "../../components/AuthLayout";
import * as Linking from "expo-linking"; // Cần thiết để mở URL
import { useState } from "react";
import { authApi } from "../../api/authApi";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import colors from "tailwindcss/colors";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import * as AuthSession from "expo-auth-session";

const Login = () => {
  const jsonData = require("../../mock/data.config.register.json");
  const jsonStyle = require("../../mock/data.styles.json");

  const fieldsRender = jsonData.info.filter(
    (item) => item.field === "username" || item.field === "password",
  );
  const [user, setUser] = useState({});
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
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
        console.error("Login ", ex.message);
      } finally {
        setLoading(false);
      }
    }
  };
  const loginGoogle = async () => {
    try {
      // Redirect URI về app
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "oucourse",
        path: "oauthredirect",
      });
      console.log("redirectUri =", redirectUri);
      // Backend build Google auth URL (nên include redirect_uri)
      const res = await axiosClient.post(endpoints.googleCallback, {
        params: { redirect_uri: redirectUri, auth_type: "django" },
      });

      const authUrl = res.data?.auth_url;
      console.log(authUrl);
      if (!authUrl) throw new Error("Missing auth_url from backend");

      // Mở phiên đăcng nhập + chờ redirect về app
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri,
      );
      if (result.type !== "success" || !result.url) return;

      // Parse callback: oucourse://... ?code=...&state=...
      const parsed = Linking.parse(result.url);
      const code = parsed.queryParams?.code;
      const state = parsed.queryParams?.state;

      if (!code || !state) throw new Error("Missing code/state in callback");

      // Gọi backend đổi code -> token/session
      const loginRes = await axiosClient.get(endpoints.googleCallback, {
        code,
        state,
        redirect_uri: redirectUri,
      });
    } catch (ex) {
      console.error("Lỗi Google Auth:", ex);
    }
  };

  return (
    <AuthLayout title="ĐĂNG NHẬP NGƯỜI DÙNG">
      <HelperText type="error" visible={err}>
        Mật khẩu KHÔNG khớp!
      </HelperText>
      {fieldsRender.map((item) => {
        const isPasswordField =
          item.field === "password" || item.field === "confirm";

        const isVisible =
          item.field === "password" ? showPassword : showConfirmPass;
        const toggleVisibility = () => {
          if (item.field === "password") setShowPassword(!showPassword);
          else setShowConfirmPass(!showConfirmPass);
        };
        return (
          <TextInput
            key={item.field}
            value={user[item.field]}
            onChangeText={(t) => setUser({ ...user, [item.field]: t })}
            label={item.title}
            secureTextEntry={isPasswordField ? !isVisible : false}
            activeOutlineColor={colors.slate[500]}
            right={
              isPasswordField ? (
                <TextInput.Icon
                  icon={isVisible ? "eye-off" : "eye"}
                  onPress={toggleVisibility}
                />
              ) : (
                <TextInput.Icon icon={item.icon} />
              )
            }
            mode="outlined"
          />
        );
      })}
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
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-[1px] bg-slate-200" />
        <TextCustom.TextFocus
          text=" Hoặc đăng nhập bằng "
          style={{ fontSize: 12 }}
        />
        <View className="flex-1 h-[1px] bg-slate-200" />
      </View>

      <View className="flex-row justify-center gap-4">
        <IconButton
          icon="google"
          mode="outlined"
          iconColor="#DB4437"
          size={30}
          onPress={loginGoogle}
          style={{ borderColor: "#DB4437" }}
        />
      </View>
    </AuthLayout>
  );
};

export default Login;
