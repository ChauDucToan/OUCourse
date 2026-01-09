import { View } from "react-native";
import TextCustom from "./TextCustom";
import { Picker } from "@react-native-picker/picker";

const SelectTime = ({ theme, hour, setHour, minute, setMinute }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <View className="mt-4">
      <TextCustom.TextFocus
        text="Thời lượng dự kiến"
        style={{ color: theme.colors.slate[800], marginBottom: 8 }}
      />
      <View className="flex-row gap-3">
        <View
          className="flex-1 rounded-xl overflow-hidden border border-gray-300"
          style={{ backgroundColor: "white" }}
        >
          <Picker
            selectedValue={hour}
            onValueChange={setHour}
            dropdownIconColor={theme.colors.slate[600]}
          >
            {hours.map((h) => (
              <Picker.Item
                key={h}
                label={`${h} giờ`}
                value={h}
                style={{ fontSize: 14 }}
              />
            ))}
          </Picker>
        </View>

        <View
          className="flex-1 rounded-xl overflow-hidden border border-gray-300"
          style={{ backgroundColor: "white" }}
        >
          <Picker selectedValue={minute} onValueChange={setMinute}>
            {minutes.map((m) => (
              <Picker.Item
                key={m}
                label={`${m} phút`}
                value={m}
                style={{ fontSize: 14 }}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

export default SelectTime;
