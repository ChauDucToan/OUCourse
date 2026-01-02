import { List } from "react-native-paper";
import TextCustom from "./TextCustom";

const jsonStyle = require("../mock/data.styles.json");

const ListItem = ({ mapJson, navigation, header }) => {
  return (
    <List.Section className="bg-white mt-2 border-t border-b border-slate-200">
      <List.Subheader className="text-slate-400 font-bold text-xs uppercase">
        {header}
      </List.Subheader>
      {mapJson &&
        mapJson.map((item) => (
          <List.Item
            key={item.key}
            className={jsonStyle["list-item"]}
            title={() => <TextCustom.TextMuted text={item.title} />}
            description={item.description}
            left={(props) => <List.Icon {...props} icon={item.iconLeft} />}
            right={(props) => (
              <List.Icon {...props} icon="chevron-right" color="#cbd5e1" />
            )}
            onPress={() => navigation.navigate(item.urlNavigate)}
          />
        ))}
    </List.Section>
  );
};
export default ListItem;
