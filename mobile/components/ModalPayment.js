import { Modal } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";

export default function PaymentSelectionModal({
  isVisible,
  onClose,
  onSelect,
}) {
  const paymentMethods = [
    { id: "zalopay", label: "Zalopay" },
    { id: "stripe", label: "Stripe" },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View className="bg-white p-5 rounded-tl-xl rounded-tr-xl">
          <Text className="text-lg font-bold mb-4">Choose Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              className="py-3 border-b border-gray-200"
              onPress={() => {
                onSelect(method);
                onClose();
              }}
            >
              <Text className="text-base">{method.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity className="mt-4 items-center" onPress={onClose}>
            <Text className="text-red-500 text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
