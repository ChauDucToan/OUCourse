import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveTokens = async (accessToken, refreshToken) => {
  await AsyncStorage.setItem("access_token", accessToken);
  await AsyncStorage.setItem("refresh_token", refreshToken);
};

export const getTokens = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  const refreshToken = await AsyncStorage.getItem("refresh_token");
  return { accessToken, refreshToken };
};
