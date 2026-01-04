import { View, ScrollView, Text, Pressable, Image } from "react-native";
import { Avatar, Button, List } from "react-native-paper";
import ListItem from "../../components/ListItem";
import colors from "tailwindcss/colors";
import { useContext } from "react";
import { MyUserContext } from "../../utils/contexts/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountScreen = ({ navigation }) => {
  const jsonAccountData = require("../../mock/data.config.account.json");
  const [user, dispatch] = useContext(MyUserContext);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      dispatch({ type: "logout" });
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };
  console.log("user ne", user);
  return (
    <ScrollView className="flex-1 bg-slate-50 mt-10">
      {user && (
        <View>
          <View className="bg-white  p-5 flex flex-row items-center justify-around border-b border-slate-200">
            <View>
              <Avatar.Image
                size={80}
                source={{ uri: user.avatar }}
                className="bg-slate-200"
              />
            </View>
            <View>
              <Text className="text-xl font-bold text-slate-800 mt-3">
                {user.first_name + user.last_name}
              </Text>
              <Text className="text-slate-500">{user.username}</Text>
              <Pressable
                onPress={() => navigation.navigate("AccountDetailedScreen")}
                className="mt-3 p-2 rounded-xl shadow-sm bg-slate-600 active:bg-slate-700 active:opacity-90"
              >
                <Text className="text-white font-bold text-xs text-center">
                  Chỉnh sửa hồ sơ
                </Text>
              </Pressable>
            </View>
          </View>
          <View>
            <ListItem
              mapJson={jsonAccountData.personal}
              navigation={navigation}
              header="cá nhân"
            />
          </View>
          <View>
            <ListItem
              mapJson={jsonAccountData.system}
              navigation={navigation}
              header="hệ thống"
            />
          </View>

          <View className="p-4 mt-2 mb-8">
            <Button
              mode="outlined"
              textColor={colors.red[500]}
              className="rounded-xl border-red-200 bg-white"
              contentStyle={{ paddingVertical: 4 }}
              icon="logout"
              onPress={handleLogout}
            >
              Đăng xuất
            </Button>
          </View>
        </View>
      )}
      {!user && (
        <View>
          <View>
            <ListItem
              mapJson={jsonAccountData.system}
              navigation={navigation}
              header="hệ thống"
            />
          </View>
          <View className="p-4 mt-2 mb-8">
            <Pressable
              onPress={() => navigation.navigate("Login")}
              className="flex-row items-center justify-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm active:bg-slate-50 mt-4"
            >
              <List.Icon icon="login" color={colors.slate[500]} />

              <Text className="font-bold text-slate-500 ml-1">Đăng nhập</Text>
            </Pressable>
          </View>
          <Text className="text-center text-slate-400 text-xs mt-4">
            Phiên bản 1.0.0
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AccountScreen;
