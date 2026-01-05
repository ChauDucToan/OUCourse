import { View } from "react-native";
import { List } from "react-native-paper";
import ListItem from "../../components/ListItem";

const Setting = ({ navigation }) => {
  const jsonConfigSetting = require("../../mock/data.config.settings.json");
  return (
    <View>
      <List.Section className="p-2">
        {jsonConfigSetting["menu-setting"].map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            iconLeft={item["icon-left"]}
            navigation={navigation}
            urlNavigate={item["url-navigate"]}
          ></ListItem>
        ))}
      </List.Section>
    </View>
  );
};
export default Setting;
