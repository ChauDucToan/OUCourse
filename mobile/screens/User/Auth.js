import { useState } from "react";
import { Pressable } from "react-native";
import { View, Button } from "react-native";
import { List, TextInput } from "react-native-paper";
import colors from "tailwindcss/colors";
import TextCustom from "../../components/TextCustom";
import { useContext } from "react";
import { MyUserContext } from "../../utils/contexts/MyContext";
import { authApis, endpoints } from "../../utils/Apis";
import { useNavigation, useRoute } from "@react-navigation/native";

const Auth = () => {
  const jsonData = require("../../mock/data.config.register.json");
  const jsonStyle = require("../../mock/data.styles.json");

  const [isLogin, setIsLogin] = useState(true);
  const [, dispatch] = useContext(MyUserContext);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState(false);

  const nav = useNavigation();
  const route = useRoute();

  const fieldsRender = isLogin
    ? jsonData.info.filter(
        (item) => item.field === "username" || item.field === "password",
      )
    : jsonData.info;
  const changeValue = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };
  const validate = () => {
    if (!user.password || user.password !== user.confirm) {
      setErr(true);
      return false;
    }
    return true;
  };

  const Login = async ({ route }) => {
    if (validate() === true) {
      try {
        setLoading(true);
        let res = await Apis.post(endpoints["login"], {
          ...user,
          client_id: "4jr0cMT5CiZAW3ZAaW5Sx3Ex9JC1yNjnK34k85ga", // Lưu vào biến môi trường của react
          client_secret:
            "2gYKjItC9dWyLTpzodprh8P3Pk8TUgkyOuSB1JmVMH3wW6s3e4HgvIw9QGkY7M2w5xLNY1TxMB3pWxPYv0MkmBOMAlYM9PKrPwYdZ9SBEgEZrbg3gbctt5LF965qMNEh", // Lưu vào biến môi trường của react
          grant_type: "password",
        });

        AsyncStorage.setItem("token", res.data.access_token);

        setTimeout(async () => {
          let user = await authApis(res.data.access_token).get(
            endpoints["current_user"],
          );
          dispatch({
            type: "login",
            payload: user.data,
          });
          const next = route.params?.next;
          if (next) nav.navigate(next);
        });
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="p-4">
      {fieldsRender.map((item) => (
        <TextInput
          key={item.field}
          label={item.title}
          secureTextEntry={item.secureTextEntry}
          activeOutlineColor={colors.slate[500]}
          right={<TextInput.Icon icon={item.icon} />}
          mode="outlined"
        />
      ))}
      <View className="flex mb-2 flex-row-reverse gap-5 mt-3">
        {isLogin ? (
          <Pressable
            onPress={() => setIsLogin(true)}
            className={jsonStyle["pressable-focus"]}
          >
            <TextCustom.TextFocus text="ĐĂNG NHẬP" />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setIsLogin(true)}
            className={jsonStyle["pressable-no-focus"]}
          >
            <List.Icon color={colors.slate[500]} icon="chevron-left" />
          </Pressable>
        )}

        {!isLogin ? (
          <Pressable
            onPress={() => setIsLogin(false)}
            className={jsonStyle["pressable-focus"]}
          >
            <TextCustom.TextFocus text="XÁC NHẬN ĐĂNG KÝ" />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setIsLogin(false)}
            className={jsonStyle["pressable-no-focus"]}
          >
            <TextCustom.TextNoFocus text="ĐĂNG KÝ" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Auth;
