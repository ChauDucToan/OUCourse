import { useState } from "react";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

const Appearance = () => {
  const [value, setValue] = useState("system");
  const jsonData = require("../../mock/data.config.apperance.json");
  return (
    <View className="p-2">
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={jsonData.apperance}
      />
    </View>
  );
};

export default Appearance;
