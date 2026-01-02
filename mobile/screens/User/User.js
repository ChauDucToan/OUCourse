import { useContext } from "react";
import { MyUserContext } from "../../utils/contexts/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { Button } from "react-native";

const User = () => {
  const [user, dispatch] = useContext(MyUserContext);
  const logout = async () => {
    AsyncStorage.removeItem("token");
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
