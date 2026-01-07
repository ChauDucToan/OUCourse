import { Text } from "react-native";

const jsonStyle = require("../mock/data.styles.json");

const TextFocus = ({ text, className = "" }) => {
  return (
    <Text className={`${jsonStyle["text-focus"]} ${className}`}>{text}</Text>
  );
};
const TextNoFocus = ({ text, className = "" }) => {
  return (
    <Text className={`${jsonStyle["text-no-focus"]} ${className}`}>{text}</Text>
  );
};
const TextMuted = ({ text, className = "" }) => {
  return (
    <Text className={`${jsonStyle["text-muted"]} ${className}`}>{text}</Text>
  );
};

const TextSection = ({ text, className = "" }) => (
  <Text className={`text-2xl font-bold text-slate-700 ${className}`}>
    {text}
  </Text>
);

export default { TextFocus, TextNoFocus, TextMuted, TextSection };
