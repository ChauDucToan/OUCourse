import { View } from "react-native";
import { Button } from "react-native";
import { removeTokens } from "../../utils/tokenUtils";
import { useUser } from "../../hooks/useUser";

const User = () => {
  const [user, dispatch] = useUser();
  const logout = async () => {
    removeTokens();
    dispatch({
      type: "logout",
    });
  };
  return (
    <View>
      <Text>Welcome {user.username}!</Text>
      <Button mode="contained-tonal" icon="account" onPress={logout}>
        Đăng xuất
      </Button>
    </View>
  );
};

export default User;
