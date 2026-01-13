import { useState } from "react";
import { TextInput } from "react-native-paper";

const FormAuth = ({ item, theme, value, onChangeText }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const isPasswordField = item.field === "password" || item.field === "confirm";
  const isVisible = item.field === "password" ? showPassword : showConfirmPass;

  const toggleVisibility = () => {
    if (item.field === "password") setShowPassword(!showPassword);
    else setShowConfirmPass(!showConfirmPass);
  };

  return (
    <TextInput
      key={item.field}
      value={value}
      onChangeText={onChangeText}
      label={item.title}
      secureTextEntry={isPasswordField ? !isVisible : false}
      activeOutlineColor={theme.colors.slate[500]}
      placeholderTextColor={theme.colors.slate[600]}
      textColor={theme.colors.slate[400]}
      theme={{
        colors: {
          onSurfaceVariant: theme.colors.slate[600],
        },
      }}
      style={{ color: theme.colors.slate[400] }}
      outlineColor={theme.colors.slate[800]}
      right={
        isPasswordField ? (
          <TextInput.Icon
            icon={isVisible ? "eye-off" : "eye"}
            color={(isFocused) =>
              isFocused ? theme.colors.slate[500] : theme.colors.slate[600]
            }
            onPress={toggleVisibility}
          />
        ) : (
          <TextInput.Icon
            color={(isFocused) =>
              isFocused ? theme.colors.slate[500] : theme.colors.slate[600]
            }
            icon={item.icon}
          />
        )
      }
      mode="outlined"
    />
  );
};
export default FormAuth;
