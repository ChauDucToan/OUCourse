import { useState } from "react";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

const Appearance = () => {
  const [value, setValue] = useState("light");
  const { theme, themeDispatch } = useColors();
  const jsonData = require("../../mock/data.config.apperance.json");

  return (
    <View className="p-2">
      <SegmentedButtons
        style={{
          backgroundColor: theme.colors.gray[100],
          color: theme.colors.slate[400],
        }}
        value={value}
        onValueChange={(v) => {
          setValue(v);

          if (v === "light")
            themeDispatch({ type: "SET_THEME", mode: "light" });
          if (v === "dark") themeDispatch({ type: "SET_THEME", mode: "dark" });
        }}
        theme={{
          colors: {
            primary: theme.colors.slate[400],
            secondaryContainer: theme.colors.slate[400],
            onSecondaryContainer: theme.colors.slate[600],
            onSurface: theme.colors.gray[400],
          },
        }}
        buttons={jsonData.apperance}
      />
    </View>
  );
};

export default Appearance;
