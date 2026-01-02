import { Text } from "react-native";
import { View } from "react-native";
import { List } from "react-native-paper";

const Setting = ({ navigation }) => {
  const jsonStyle = require("../../mock/data.styles.json");
  return (
    <View className={jsonStyle["list-header"]}>
      <List.Section>
        <List.Subheader>
          <Text className="text-xl p-0 m-0 font-bold">Tùy chọn chung</Text>
        </List.Subheader>
        <List.Item
          className={jsonStyle["list-item"]}
          title="Giao diện"
          left={() => <List.Icon icon="theme-light-dark" />}
          onPress={() => navigation.navigate("Apperance")}
        />
        <List.Item
          className={jsonStyle["list-item"]}
          title="Tài khoản"
          left={() => <List.Icon icon="account" />}
          onPress={() => navigation.navigate("Auth")}
        />
      </List.Section>
    </View>
  );
};
export default Setting;
