import { View } from "react-native";
import HeaderBack from "./HeaderBack";
import TextCustom from "./TextCustom";

import { Divider } from "react-native-paper";
import { useColors } from "../hooks/useColors";

const HeaderCustom = ({ text = "", viewClass = "", targetScreen = "" }) => {
  const { theme } = useColors();
  return (
    <View className="mb-6">
      <View className="flex-row items-center ">
        <View className={`w-16 ${viewClass}`}>
          <HeaderBack theme={theme} targetScreen={targetScreen} />
        </View>
        <View className="items-center flex-1 py-1">
          <TextCustom.TextSection
            className="text-xl"
            text={text}
            style={{ color: theme.colors.slate[500] }}
          />
        </View>
        <View className={`w-16 ${viewClass}`}></View>
      </View>
      <Divider />
    </View>
  );
};
export default HeaderCustom;
