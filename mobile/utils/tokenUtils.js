import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const TOKEN_KEY = "TOKEN";

export const saveTokens = async (accessToken, refreshToken) => {
  try {
    const keys = JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    await setItemAsync(TOKEN_KEY, keys);
    console.log("save token success!");
  } catch (error) {
    console.error("save token failed: ", error.message);
  }
};

export const getTokens = async () => {
  try {
    const jsonData = await getItemAsync(TOKEN_KEY);
    console.log("get token success!");

    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error("get token failed: ", error.message);
    return null;
  }
};

export const removeTokens = async () => {
  try {
    await deleteItemAsync(TOKEN_KEY);
    console.log("remove token success!");
  } catch (error) {
    console.error("Remove token failed: ", error.message);
  }
};
