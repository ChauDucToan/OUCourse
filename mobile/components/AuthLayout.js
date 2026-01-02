import { View, ScrollView } from "react-native";
import TextCustom from "./TextCustom";

const AuthLayout = ({ title, children }) => {
  return (
    <View className="flex-1 bg-white p-4 justify-center">
      <View className="mb-6 items-center">
        <TextCustom.TextFocus text={title} />
      </View>
      {children}
    </View>
  );
};
export default AuthLayout;
