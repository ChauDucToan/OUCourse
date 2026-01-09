import { List } from "react-native-paper";
import TextCustom from "./TextCustom";
import Appearance from "../screens/Setting/Appearance";

const jsonStyle = require("../mock/data.styles.json");

const ListItem = ({ mapJson, navigation, header, theme }) => {
  return (
    <List.Section
      className="mt-2  border-b "
      style={{
        backgroundColor: theme.colors.gray[100],
        borderColor: theme.colors.slate[200],
      }}
    >
      <List.Subheader
        className=" font-bold text-xs uppercase"
        style={{
          color: theme.colors.slate[400],
        }}
      >
        {header}
      </List.Subheader>
      {mapJson &&
        mapJson.map((item, index) => {
          if (item.title !== "Theme") {
            return (
              <List.Item
                key={item.id ? item.id.toString() : index.toString()}
                className={jsonStyle["list-item"]}
                style={{
                  backgroundColor: theme.colors.slate[200],
                  borderColor: theme.colors.gray[500],
                }}
                title={() => (
                  <TextCustom.TextMuted
                    style={{ color: theme.colors.slate[500] }}
                    text={item.title}
                  />
                )}
                description={() => (
                  <TextCustom.TextMuted
                    style={{ color: theme.colors.slate[400], fontSize: 13 }}
                    text={item.description}
                  />
                )}
                left={(props) => (
                  <List.Icon
                    {...props}
                    color={theme.colors.slate[600]}
                    icon={item.iconLeft}
                  />
                )}
                right={(props) => (
                  <List.Icon
                    {...props}
                    icon="chevron-right"
                    color={theme.colors.iconDefault}
                  />
                )}
                onPress={() => navigation.navigate(item.navUrl, item.navParams)}
              />
            );
          } else {
            return (
              <Appearance
                key={item.id ? item.id.toString() : index.toString()}
              />
            );
          }
        })}
    </List.Section>
  );
};
export default ListItem;
