import { useState } from "react";
import { Pressable } from "react-native";
import { View, Button } from "react-native";
import { List, TextInput } from "react-native-paper";
import colors from "tailwindcss/colors";
import TextCustom from "../../components/TextCustom";

const Auth = () => {
  const jsonData = require("../../mock/data.config.register.json");
  const jsonStyle = require("../../mock/data.styles.json");

  const [isLogin, setIsLogin] = useState(true);
  const fieldsRender = isLogin
    ? jsonData.info.filter(
        (item) => item.field === "username" || item.field === "password",
      )
    : jsonData.info;
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
            <TextCustom.TextFocus text="ĐĂNG KÝ" />
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
