import { useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import colors from "tailwindcss/colors";

const Auth = () => {
  const jsonData = require("../../mock/data.config.register.json");
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
      <View className="flex mb-2 flex-row-reverse gap-3 mt-2">
        <Button className="border-2 bg-slate-500 ">
          <Text className="text-white">
            {isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
          </Text>
        </Button>
        <Button className="border-2 ">
          <Text className="text-black">
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default Auth;
