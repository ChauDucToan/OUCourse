import { View } from "react-native";
import HeaderCustom from "./Header";
import { useContext } from "react";
import { MyColorContext } from "../utils/contexts/MyColorContext";

const AuthLayout = ({ title, children }) => {
  const { theme } = useContext(MyColorContext);

  return (
    <View
      className="flex-1  p-4 justify-center"
      style={{
        backgroundColor: theme.colors.gray[100],
      }}
    >
      <HeaderCustom text={title} />
      {children}
    </View>
  );
};
export default AuthLayout;
