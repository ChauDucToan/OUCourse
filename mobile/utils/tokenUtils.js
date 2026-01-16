import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { errorConsole } from "./errorUtils";

const TOKEN_KEY = "TOKEN";

export const saveTokens = async (accessToken, refreshToken) => {
  try {
    const keys = JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    await setItemAsync(TOKEN_KEY, keys);
  } catch (error) {
    errorConsole(error, "saveTokens");
  }
};

export const getTokens = async () => {
  try {
    const jsonData = await getItemAsync(TOKEN_KEY);
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    errorConsole(error, "getTokens");
    return null;
  }
};

export const removeTokens = async () => {
  try {
    await deleteItemAsync(TOKEN_KEY);
    console.log("Remove successs!");
  } catch (error) {
    errorConsole(error, "removeTokens");
  }
};
