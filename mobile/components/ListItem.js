import { List } from "react-native-paper";
import TextCustom from "./TextCustom";

const jsonStyle = require("../mock/data.styles.json");

const ListItem = ({ title, iconLeft, navigation, urlNavigate }) => {
  return (
    <List.Item
      className={jsonStyle["list-item"]}
      title={() => <TextCustom.TextMuted text={title} />}
      left={() => <List.Icon icon={iconLeft} />}
      onPress={() => navigation.navigate(urlNavigate)}
    />
  );
};
export default ListItem;
