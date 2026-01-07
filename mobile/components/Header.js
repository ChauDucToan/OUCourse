import { View } from "react-native";
import HeaderBack from "./HeaderBack";
import TextCustom from "./TextCustom";
import { useContext } from "react";
import { MyColorContext } from "../utils/contexts/MyColorContext";

const HeaderCustom = ({ text, viewClass = "" }) => {
  const { theme } = useContext(MyColorContext);
  return (
    <View className="flex-row items-center ">
      <View className={`w-16 ${viewClass}`}>
        <HeaderBack theme={theme} />
      </View>
      <View className="items-center py-1">
        <TextCustom.TextSection
          text={text}
          style={{ color: theme.colors.slate[500] }}
        />
      </View>
      <View className={`w-16 ${viewClass}`}></View>
    </View>
  );
};
export default HeaderCustom;
