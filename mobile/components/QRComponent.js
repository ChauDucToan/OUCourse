import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function PaymentQR({ paymentUrl }) {
  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <QRCode value={paymentUrl} size={200} />
    </View>
  );
}
