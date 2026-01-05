import { useContext } from "react";
import { MyUserContext } from "../../utils/contexts/MyContext";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { ActivityIndicator, Avatar, Divider, Icon } from "react-native-paper";
import colors from "tailwindcss/colors";
import { ScrollView } from "react-native";
import { useState } from "react";
import { TextInput } from "react-native";
import { Pressable } from "react-native";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import * as ImagePicker from "expo-image-picker";
import HeaderBack from "../../components/HeaderBack";
import HeaderCustom from "../../components/Header";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";

const InfoRow = ({ subject, text, icon, isEdit, onChangeText, value }) => (
  <TouchableOpacity className="flex-row items-center py-4">
    <View className="bg-blue-50 p-2 rounded-full mr-4">
      <Icon source={icon} size={24} color={colors.slate[700]} />
    </View>
    <View className="flex-1">
      <Text className="text-xs uppercase font-semibold text-gray-500 ">
        {subject}
      </Text>
      {!isEdit ? (
        <Text className="text-base pt-2 font-medium text-gray-800 ">
          {text || "Chưa cập nhật"}
        </Text>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="bg-white border border-blue-500 rounded-lg p-2 text-base text-gray-800"
          placeholder={`Nhập ${subject.toLowerCase()}`}
        />
      )}
    </View>
  </TouchableOpacity>
);

const AccountDetailedScreen = () => {
  const [user, dispatch] = useContext(MyUserContext);
  const [isEdit, setIsEdit] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null); // State lưu ảnh mới chọn

  const route = useRoute();
  const { isEditParam } = route.params || {};

  useEffect(() => {
    setUserFirstName(user.first_name);
    setUserLastName(user.last_name);
    setIsEdit(isEditParam);
  }, []);
  const pickImage = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permissions denied!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) setSelectedAvatar(result.assets[0]);
    }
  };
  const getMimeType = (fileUri) => {
    const extension = fileUri.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "heic":
        return "image/heic";
      default:
        return "image/jpeg";
    }
  };
  const handleEditSave = async () => {
    const isChanged =
      userFirstName !== user.first_name ||
      userLastName !== user.last_name ||
      selectedAvatar !== null;

    if (!isChanged) {
      setIsEdit(false);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("first_name", userFirstName);
      formData.append("last_name", userLastName);
      if (selectedAvatar) {
        formData.append("avatar", {
          uri: selectedAvatar.uri,
          name: selectedAvatar.uri.split("/").pop(),
          type: getMimeType(selectedAvatar.type),
        });
      }

      const res = await axiosClient.patch(endpoints.current_user, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 202) {
        dispatch({ type: "login", payload: res.data });
        alert("Cập nhật thành công!");
        setIsEdit(false);
        setSelectedAvatar(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="bg-white flex-1">
      <View className="bg-white pb-8 rounded-b-3xl shadow-sm items-center pt-12 px-5">
        <HeaderCustom text={"HỒ SƠ NGƯỜI DÙNG"} />
        {!isEdit ? (
          <Avatar.Image
            size={80}
            source={{ uri: selectedAvatar ? selectedAvatar.uri : user.avatar }}
            className="bg-slate-200 mt-4"
          />
        ) : (
          <Pressable onPress={pickImage}>
            <Avatar.Image
              size={80}
              source={{
                uri: selectedAvatar ? selectedAvatar.uri : user.avatar,
              }}
              className="bg-slate-200 "
            />
            <View className="absolute bottom-0 right-0 bg-slate-600 rounded-full border-2 border-white p-1">
              <Icon source="camera" color="white" size={16} />
            </View>
          </Pressable>
        )}
        <Text className="text-xl font-bold">{user.username}</Text>
        <Text className="text-base font-light">
          {user.first_name + " " + user.last_name}
        </Text>
      </View>
      <View className="p-5 pt-0">
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <InfoRow
            subject={"Họ người dùng"}
            value={isEdit ? userFirstName : user.first_name}
            text={user.first_name}
            icon={isEdit ? "square-edit-outline" : "account-group-outline"}
            isEdit={isEdit}
            onChangeText={setUserFirstName}
          />

          <Divider />
          <InfoRow
            subject={"Tên người dùng"}
            value={isEdit ? userLastName : user.last_name}
            text={user.last_name}
            icon={isEdit ? "rename-box" : "account-outline"}
            isEdit={isEdit}
            onChangeText={setUserLastName}
          />

          <Divider />

          <InfoRow
            subject={"Vai trò"}
            text={user.role === "admin" ? "Quản trị viên" : "Người dùng"}
            icon="account-key"
            isEdit={false}
          />
          <Divider />

          <InfoRow
            subject={"Email"}
            text={user.email}
            icon="email"
            isEdit={false}
          />
        </View>
        <Pressable
          loading={isLoading}
          className="mt-6 bg-slate-600 py-3  rounded-2xl justify-end items-center shadow-blue-200 shadow-lg"
          onPress={() => {
            if (isEdit) {
              handleEditSave();
            } else {
              setUserFirstName(user.first_name);
              setUserLastName(user.last_name);
              setIsEdit(true);
            }
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">
              {isEdit ? "Lưu thay đổi" : "Chỉnh sửa hồ sơ"}
            </Text>
          )}
        </Pressable>
        {isEdit && !isLoading && (
          <TouchableOpacity
            className="mt-4 items-center"
            onPress={() => {
              setIsEdit(false);
              setSelectedAvatar(null);
            }}
          >
            <Text className="text-gray-500 font-semibold">Hủy bỏ</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};
export default AccountDetailedScreen;
