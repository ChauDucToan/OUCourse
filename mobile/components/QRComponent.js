import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function PaymentQR({ paymentUrl }) {
  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <QRCode
        value={paymentUrl} // chính là paymentRes.data.payment_url
        size={200} // kích thước QR
      />
    </View>
  );
}
