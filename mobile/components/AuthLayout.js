import { View } from "react-native";
import HeaderCustom from "./Header";

const AuthLayout = ({ title, children }) => {
  const { theme } = useColors();

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
