import { View, TextInput } from "react-native";
import TextCustom from "./TextCustom";

const SelectTime = ({ theme, hour, setHour, minute, setMinute }) => {
  const MAXTIME = 1000;
  const validateTime = (num) => {
    return Number.isInteger(num) && num >= 0 && num < MAXTIME;
  };

  return (
    <View className="mt-4">
      <TextCustom.TextFocus
        text="Thời lượng dự kiến"
        style={{ color: theme.colors.slate[800], marginBottom: 8 }}
      />

      <View className="flex-row gap-3">
        <TextInput
          value={hour !== 0 ? hour.toString() : ""}
          onChangeText={(text) => {
            if (text === "") {
              setHour(0);
              return;
            }

            const val = parseInt(text, 10);
            if (validateTime(val)) setHour(val);
          }}
          keyboardType="numeric"
          placeholder="Giờ"
          className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
        />

        <TextInput
          value={minute !== 0 ? minute.toString() : ""}
          onChangeText={(text) => {
            if (text === "") {
              setMinute(0);
              return;
            }
            const val = parseInt(text, 10);
            if (validateTime(val)) {
              setMinute(val);
            }
          }}
          keyboardType="numeric"
          placeholder="Phút"
          className="flex-1 border border-gray-300 rounded-lg p-2 bg-white"
        />
      </View>
    </View>
  );
};

export default SelectTime;
