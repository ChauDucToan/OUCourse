import { View } from "react-native";
import HeaderCustom from "./Header";

const AuthLayout = ({ title, children }) => {
  return (
    <View className="flex-1 bg-white p-4 justify-center">
      <HeaderCustom text={title} />
      {children}
    </View>
  );
};
export default AuthLayout;
