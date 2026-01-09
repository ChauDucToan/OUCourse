import { View } from "react-native";
import HeaderBack from "./HeaderBack";
import TextCustom from "./TextCustom";
import { useContext } from "react";
import { MyColorContext } from "../utils/contexts/MyColorContext";
import { Divider } from "react-native-paper";

const HeaderCustom = ({ text, viewClass = "" }) => {
  const { theme } = useContext(MyColorContext);
  return (
    <View className="mb-6">
      <View className="flex-row items-center ">
        <View className={`w-16 ${viewClass}`}>
          <HeaderBack theme={theme} />
        </View>
        <View className="items-center flex-1 py-1">
          <TextCustom.TextSection
            className="text-xl"
            text={text}
            style={{ color: theme.colors.slate[500] }}
          />
        </View>
        <View className={`w-4 ${viewClass}`}></View>
      </View>
      <Divider />
    </View>
  );
};
export default HeaderCustom;
