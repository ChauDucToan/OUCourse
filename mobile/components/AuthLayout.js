import { View, ScrollView } from "react-native";
import TextCustom from "./TextCustom";
import HeaderBack from "./HeaderBack";

const AuthLayout = ({ title, children }) => {
  return (
    <View className="flex-1 bg-white p-4 justify-center">
      <View className="flex-row items-center  mb-6">
        <HeaderBack />

        <View className="ml-10 items-center">
          <TextCustom.TextFocus text={title} />
        </View>
      </View>

      {children}
    </View>
  );
};
export default AuthLayout;
