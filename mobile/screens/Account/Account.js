import { View, ScrollView, Text, Pressable, Image } from "react-native";
import { Avatar, Button, List } from "react-native-paper";
import ListItem from "../../components/ListItem";
import { useContext } from "react";
import { MyUserContext } from "../../utils/contexts/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderCustom from "../../components/Header";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

const Account = ({ navigation }) => {
  const jsonAccountData = require("../../mock/data.config.account.json");
  const [user, dispatch] = useContext(MyUserContext);
  const { theme } = useContext(MyColorContext);
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
    <ScrollView
      className="flex-1 pt-10"
      style={{
        backgroundColor: theme.colors.gray[100],
      }}
      contentContainerStyle={{
        paddingBottom: 80,
      }}
    >
      <HeaderCustom text="" />
      {user && (
        <View>
          <View
            style={{
              backgroundColor: theme.colors.gray[100],
            }}
            className=" p-5 flex flex-row items-center justify-around border-b "
          >
            <View>
              <Avatar.Image
                size={80}
                source={{ uri: user.avatar }}
                style={{
                  backgroundColor: theme.colors.slate[200],
                  borderColor: theme.colors.slate[200],
                }}
              />
            </View>
            <View>
              <Text
                className="text-xl font-bold mt-3"
                style={{
                  color: theme.colors.slate[800],
                }}
              >
                {user.first_name + " " + user.last_name}
              </Text>
              <Text
                style={{
                  color: theme.colors.slate[500],
                }}
              >
                {user.username}
              </Text>
              <Pressable
                onPress={() =>
                  navigation.navigate("AccountDetailedScreen", {
                    isEditParam: true,
                  })
                }
                className="mt-3 p-2 rounded-xl shadow-sm active:opacity-90"
                style={{
                  backgroundColor: theme.colors.slate[600],
                }}
              >
                <Text
                  className="font-bold text-xs text-center"
                  style={{
                    color: theme.colors.gray[100],
                  }}
                >
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
              theme={theme}
            />
          </View>
          <View>
            <ListItem
              mapJson={jsonAccountData.system}
              navigation={navigation}
              header="hệ thống"
              theme={theme}
            />
          </View>

          <View className="p-4 mt-2 mb-3">
            <Button
              mode="outlined"
              textColor={theme.colors.danger}
              className="rounded-xl  "
              style={{
                backgroundColor: theme.colors.gray[100],
                borderColor: theme.colors.danger,
              }}
              contentStyle={{
                paddingVertical: 4,
                backgroundColor: theme.colors.gray[100],
              }}
              icon="logout"
              onPress={handleLogout}
            >
              Đăng xuất
            </Button>
          </View>
          <Text
            className="text-center text-xs"
            style={{
              color: theme.colors.slate[400],
            }}
          >
            Phiên bản 1.0.0
          </Text>
        </View>
      )}
      {!user && (
        <View>
          <View>
            <ListItem
              mapJson={jsonAccountData.system}
              navigation={navigation}
              header="hệ thống"
              theme={theme}
            />
          </View>
          <View className="p-4 mt-2 mb-8">
            <Pressable
              onPress={() => navigation.navigate("Login")}
              className="flex-row items-center justify-center p-3 border  rounded-xl shadow-sm mt-4"
              style={{
                backgroundColor: theme.colors.gray[100],
                borderColor: theme.colors.slate[200],
              }}
            >
              <List.Icon icon="login" color={theme.colors.slate[500]} />

              <Text
                className="font-bold  ml-1"
                style={{
                  color: theme.colors.slate[500],
                }}
              >
                Đăng nhập
              </Text>
            </Pressable>
          </View>
          <Text
            className="text-center  text-xs mt-4"
            style={{
              color: theme.colors.slate[400],
            }}
          >
            Phiên bản 1.0.0
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Account;
