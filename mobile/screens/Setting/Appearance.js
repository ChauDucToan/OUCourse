import { useState } from "react";
import { View } from "react-native";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";

const Appearance = () => {
  const theme = useTheme();
  const [value, setValue] = useState("system");
  const jsonData = require("../../mock/data.config.apperance.json");
  return (
    <View>
      <Text
        className="mb-3 font-bold text-lg"
        style={{ color: theme.colors.onSurface }}
      >
        Giao diện
      </Text>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={jsonData.apperance}
        style={{ borderRadius: 8 }}
      />
    </View>
  );
};

export default Appearance;
