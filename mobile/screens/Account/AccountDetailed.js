import { ActivityIndicator, Avatar, Divider, Icon } from "react-native-paper";
import {
  ScrollView,
  TextInput,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderCustom from "../../components/Header";

import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { endpoints } from "../../utils/Apis";
import { getMimeType, pickImage } from "../../utils/imageUtils";
import { useUser } from "../../hooks/useUser";
import { useColors } from "../../hooks/useColors";
import { errorConsole } from "../../utils/errorUtils";
const InfoRow = ({
  subject,
  text,
  icon,
  isEdit,
  onChangeText,
  value,
  theme,
}) => (
  <TouchableOpacity className="flex-row items-center py-4">
    <View
      className="p-2 rounded-full mr-4"
      style={{
        backgroundColor: theme.colors.blue[100],
      }}
    >
      <Icon source={icon} size={24} color={theme.colors.slate[700]} />
    </View>
    <View className="flex-1">
      <Text
        className="text-xs uppercase font-semibold "
        style={{
          color: theme.colors.gray[500],
        }}
      >
        {subject}
      </Text>
      {!isEdit ? (
        <Text
          className="text-base pt-2 font-medium text-gray-800 "
          style={{
            color: theme.colors.slate[400],
          }}
        >
          {text || "Chưa cập nhật"}
        </Text>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          className="bg-white border rounded-lg p-2 text-base"
          style={{
            color: theme.colors.slate[400],
            backgroundColor: theme.colors.gray[100],
            borderColor: theme.colors.blue[500],
          }}
          placeholder={`Nhập ${subject.toLowerCase()}`}
          placeholderTextColor={theme.colors.slate[400]}
        />
      )}
    </View>
  </TouchableOpacity>
);

const AccountDetailedScreen = () => {
  const [user, dispatch] = useUser();
  const [isEdit, setIsEdit] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const { theme } = useColors();

  const route = useRoute();
  const { isEditParam } = route.params || {};

  useEffect(() => {
    setUserFirstName(user.first_name);
    setUserLastName(user.last_name);
    setUserEmail(user.email);
    setIsEdit(isEditParam);
  }, []);

  const handleEditSave = async () => {
    const isChanged =
      userFirstName !== user.first_name ||
      userLastName !== user.last_name ||
      userEmail !== user.email ||
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
      formData.append("email", userEmail);
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
      errorConsole(error, "AccountDetailedScreen:handleEditSave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className=" flex-1 pt-10"
      style={{
        backgroundColor: theme.colors.slate[200],
      }}
    >
      <HeaderCustom text={"HỒ SƠ NGƯỜI DÙNG"} />

      <View
        className="pb-8 rounded-b-3xl shadow-sm items-center pt-12 px-5"
        style={{
          backgroundColor: theme.colors.slate[300],
        }}
      >
        {!isEdit ? (
          <Avatar.Image
            size={80}
            source={{ uri: selectedAvatar ? selectedAvatar.uri : user.avatar }}
            className=" mt-4"
            style={{
              backgroundColor: theme.colors.slate[200],
            }}
          />
        ) : (
          <Pressable
            onPress={async () => {
              const img = await pickImage();
              if (img) setSelectedAvatar(img);
            }}
          >
            <Avatar.Image
              size={80}
              source={{
                uri: selectedAvatar ? selectedAvatar.uri : user.avatar,
              }}
              style={{
                backgroundColor: theme.colors.slate[200],
              }}
            />
            <View
              className="absolute bottom-0 right-0 rounded-full border-2  p-1"
              style={{
                borderColor: theme.colors.white,
              }}
            >
              <Icon source="camera" color="white" size={16} />
            </View>
          </Pressable>
        )}
        <Text
          className="text-xl font-bold"
          style={{ color: theme.colors.slate[500] }}
        >
          {user.username}
        </Text>
        <Text
          className="text-base font-light"
          style={{ color: theme.colors.slate[500] }}
        >
          {user.first_name + " " + user.last_name}
        </Text>
      </View>
      <View className="p-5">
        <View
          className="rounded-2xl p-4 shadow-sm"
          style={{
            backgroundColor: theme.colors.slate[300],
          }}
        >
          <InfoRow
            subject={"Họ người dùng"}
            value={isEdit ? userFirstName : user.first_name}
            text={user.first_name}
            icon={isEdit ? "square-edit-outline" : "account-group-outline"}
            isEdit={isEdit}
            onChangeText={setUserFirstName}
            theme={theme}
          />

          <Divider />
          <InfoRow
            subject={"Tên người dùng"}
            value={isEdit ? userLastName : user.last_name}
            text={user.last_name}
            icon={isEdit ? "rename-box" : "account-outline"}
            isEdit={isEdit}
            onChangeText={setUserLastName}
            theme={theme}
          />

          <Divider />
          <InfoRow
            subject={"Email"}
            value={isEdit ? userEmail : user.email}
            text={user.email}
            icon="email"
            isEdit={isEdit}
            onChangeText={setUserEmail}
            theme={theme}
          />
          <Divider />

          <InfoRow
            subject={"Vai trò"}
            text={user.role === "admin" ? "Quản trị viên" : "Người dùng"}
            icon="account-key"
            isEdit={false}
            theme={theme}
          />
        </View>
        <Pressable
          loading={isLoading}
          className="mt-6  py-3  rounded-2xl justify-end items-center shadow-blue-200 shadow-lg"
          style={{
            backgroundColor: theme.colors.slate[600],
          }}
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
            <Text
              className=" font-bold text-lg"
              style={{
                color: theme.colors.white,
              }}
            >
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
            <Text
              className="font-semibold"
              style={{
                color: theme.colors.gray[500],
              }}
            >
              Hủy bỏ
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};
export default AccountDetailedScreen;
