import { Pressable, View, Modal, Alert } from "react-native";
import { ActivityIndicator, HelperText, IconButton } from "react-native-paper";
import TextCustom from "../../components/TextCustom";
import AuthLayout from "../../components/AuthLayout";
import { useState } from "react";
import { authApi } from "../../api/authApi";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";
import * as AuthSession from "expo-auth-session";
import FormAuth from "../../components/FormAuth";
import { WebView } from "react-native-webview";
import { saveTokens } from "../../utils/tokenUtils";
import { useUser } from "../../hooks/useUser";
import { useColors } from "../../hooks/useColors";

const Login = () => {
  const jsonData = require("../../mock/data.config.register.json");
  const jsonStyle = require("../../mock/data.styles.json");
  const { theme } = useColors();
  const fieldsRender = jsonData.info.filter(
    (item) => item.field === "username" || item.field === "password",
  );
  const [user, setUser] = useState({ username: "", password: "" });
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [authUrl, setAuthUrl] = useState(null);
  const nav = useNavigation();
  const [, dispatch] = useUser();

  const validate = () => {
    if (!user.password || !user.username) {
      setErr(true);
      return false;
    }
    setErr(false);
    return true;
  };

  const login = async () => {
    if (validate()) {
      setLoading(true);
      try {
        await authApi.login(user);
        let userRes = await axiosClient.get(endpoints["current_user"]);
        dispatch({ type: "login", payload: userRes.data });
        nav.reset({ index: 0, routes: [{ name: "Home" }] });
      } catch (ex) {
        console.error("Login ", ex.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const loginGoogle = async () => {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "oucourse",
        path: "oauthredirect",
      });
      const params = new URLSearchParams();
      params.append("auth_type", "google");
      params.append("redirect_uri", redirectUri);

      const res = await axiosClient.get(endpoints["googleAuth"], { params });
      const url = res.data?.auth_url;
      if (!url) throw new Error("Missing auth_url from backend");

      setAuthUrl(url);
      setIsLoginVisible(true);
    } catch (ex) {
      console.error("Lỗi Google Auth:", ex);
    }
  };

  const handleWebViewNavigation = async (navState) => {
    const { url } = navState;
    if (
      url.includes("google-login-success") ||
      (url.includes("access_token") && url.includes("refresh_token"))
    ) {
      try {
        const regex = /[?&]([^=#]+)=([^&#]*)/g;
        let params = {};
        let match;
        while ((match = regex.exec(url))) {
          params[match[1]] = match[2];
        }

        const { access_token, refresh_token, error } = params;
        if (error) {
          Alert.alert("Đăng nhập thất bại", "Lỗi xác thực từ Server");
          return;
        }

        if (access_token && refresh_token) {
          await saveTokens(access_token, refresh_token);
          const userRes = await axiosClient.get(endpoints["current_user"]);
          dispatch({ type: "login", payload: userRes.data });

          setIsLoginVisible(false);
          nav.navigate("HomeTab");
        }
      } catch (error) {
        console.error("Lỗi xử lý token:", error);
        setIsLoginVisible(false);
        nav.navigate("HomeTab");
      }
    }
  };

  return (
    <AuthLayout title="ĐĂNG NHẬP NGƯỜI DÙNG">
      {fieldsRender.map((item) => (
        <FormAuth
          key={item.field}
          item={item}
          theme={theme}
          value={user[item.field] || ""}
          onChangeText={(t) => setUser({ ...user, [item.field]: t })}
        />
      ))}
      <HelperText type="error" visible={err}>
        Mật khẩu KHÔNG khớp!
      </HelperText>

      <Modal visible={isLoginVisible} animationType="slide">
        <WebView
          source={{ uri: authUrl }}
          userAgent="Mozilla/5.0 (Linux; Android 10; Android SDK built for x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
          onNavigationStateChange={async (navState) => {
            if (navState.url.includes("google-login-success")) {
              await saveTokens(access_token, refresh_token);
              const userRes = await axiosClient.get(endpoints["current_user"]);
              dispatch({ type: "login", payload: userRes.data });

              setIsLoginVisible(false);

              nav.navigate("HomeTab");
            }
          }}
        />
      </Modal>

      {/* Nút đăng nhập thường */}
      <View className="flex mb-2 flex-row-reverse gap-5 mt-3">
        <Pressable
          onPress={login}
          className={jsonStyle["pressable-focus"]}
          style={{ backgroundColor: theme.colors.gray[700] }}
        >
          {loading ? (
            <ActivityIndicator
              animating={true}
              color={theme.colors.gray[100]}
              size="small"
            />
          ) : (
            <TextCustom.TextNoFocus
              style={{ color: theme.colors.slate[200] }}
              text="ĐĂNG NHẬP"
            />
          )}
        </Pressable>

        <Pressable
          onPress={() => nav.navigate("Register")}
          className={jsonStyle["pressable-no-focus"]}
        >
          <TextCustom.TextFocus
            text="ĐĂNG KÝ"
            style={{ fontSize: 12, color: theme.colors.slate[400] }}
          />
        </Pressable>
      </View>

      {/* Nút Google */}
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
