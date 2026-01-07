import { Text } from "react-native";

const jsonStyle = require("../mock/data.styles.json");
const TextFocus = ({ text, className = "", style = {} }) => {
  return (
    <Text className={`${jsonStyle["text-focus"]} ${className}`} style={style}>
      {text}
    </Text>
  );
};
const TextNoFocus = ({ text, className = "", style = {} }) => {
  return (
    <Text
      className={`${jsonStyle["text-no-focus"]} ${className}`}
      style={style}
    >
      {text}
    </Text>
  );
};
const TextMuted = ({ text, className = "", style = {} }) => {
  return (
    <Text className={`${jsonStyle["text-muted"]} ${className}`} style={style}>
      {text}
    </Text>
  );
};

const TextSection = ({ text, className = "", style = {} }) => (
  <Text className={`text-2xl font-bold ${className}`} style={style}>
    {text}
  </Text>
);

export default { TextFocus, TextNoFocus, TextMuted, TextSection };
