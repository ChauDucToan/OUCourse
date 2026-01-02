import { Text } from "react-native";

const jsonStyle = require("../mock/data.styles.json");

const TextFocus = ({ text }) => {
  return <Text className={jsonStyle["text-focus"]}>{text}</Text>;
};
const TextNoFocus = ({ text }) => {
  return <Text className={jsonStyle["text-no-focus"]}>{text}</Text>;
};
const TextMuted = ({ text }) => {
  return <Text className={jsonStyle["text-muted"]}>{text}</Text>;
};

export default { TextFocus, TextNoFocus, TextMuted };
