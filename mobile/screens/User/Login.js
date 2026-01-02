import { Pressable, View } from "react-native";
import { ActivityIndicator, HelperText, TextInput } from "react-native-paper";
import { CLIENT_ID, CLIENT_SECRET } from "@env";
import colors from "tailwindcss/colors";
import TextCustom from "../../components/TextCustom";
import AuthLayout from "../../components/AuthLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext } from "react";
import { MyUserContext } from "../../utils/contexts/MyContext";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

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
  const route = useRoute();
  const [, dispatch] = useContext(MyUserContext);

  const validate = () => {
    if (!user.password || !user.username) {
      setErr(true);
      return false;
    }
    console.log("duoc");
    setErr(false);
    return true;
  };

  const login = async () => {
    if (validate() === true) {
      try {
        console.log("duoc-1");
        setLoading(true);
        let res = await Apis.post(endpoints["login"], {
          ...user,
          client_id: CLIENT_ID, // Lưu vào biến môi trường của react
          client_secret: CLIENT_SECRET, // Lưu vào biến môi trường của react
          grant_type: "password",
        });
        console.log("duoc-2");
        await AsyncStorage.setItem("token", res.data.access_token);
        console.log("duoc-3");

        setTimeout(async () => {
          console.log(res.data.access_token);

          let user = await authApis(res.data.access_token).get(
            endpoints["current_user"],
          );
          console.log("duoc-5");

          dispatch({
            type: "login",
            payload: user.data,
          });
          console.log("duoc-6");

          const next = route.params?.next;
          if (next) {
            navigation.navigate(next);
          } else {
            navigation.navigate("Home");
          }
          console.log("token", res.data.access_token);
        }, 500);
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
          onChangeText={(t) => setUser({ ...user, [item.field]: t })}
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
