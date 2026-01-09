import { useState } from "react";
import { View, TextInput, Modal, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";

const InputPicker = ({ value, setValue, options }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View>
      <TextInput
        value={value.toString()}
        onChangeText={(text) => {
          const num = parseInt(text, 10);
          if (!isNaN(num)) setValue(num);
        }}
        keyboardType="numeric"
        onFocus={() => setShowPicker(true)} // mở picker khi focus
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 8,
          backgroundColor: "white",
        }}
      />

      <Modal visible={showPicker} animationType="slide">
        <Picker selectedValue={value} onValueChange={(val) => setValue(val)}>
          {options.map((opt) => (
            <Picker.Item key={opt} label={`${opt}`} value={opt} />
          ))}
        </Picker>
        <Button title="Xong" onPress={() => setShowPicker(false)} />
      </Modal>
    </View>
  );
};
