import axios from "axios";
import { saveTokens } from "../utils/tokenUtils";
import { endpoints } from "../utils/Apis";
import { CLIENT_ID, CLIENT_SECRET } from "@env";
const authAxios = axios.create({
  baseURL: endpoints.baseUrl,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export const authApi = {
  login: async (user) => {
    try {
      console.log(CLIENT_ID);
      console.log(CLIENT_SECRET);
      let res = await authAxios.post(endpoints["login"], {
        username: user.username,
        password: user.password,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "password",
      });

      await saveTokens(res.data.access_token, res.data.refresh_token);

      return res;
    } catch (error) {
      console.error("login error");
      throw error;
    }
  },
  refresh: async (refreshToken) => {
    try {
      const params = new URLSearchParams();
      params.append("client_id", CLIENT_ID);
      params.append("client_secret", CLIENT_SECRET);
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", refreshToken);

      let res = await authAxios.post(endpoints["login"], params);
      const newAccessToken = res.data.access_token;
      const newRefreshToken = res.data.refresh_token || refreshToken;

      await saveTokens(newAccessToken, newRefreshToken);
      return res;
    } catch (error) {
      console.error("login error: ", error.message);
      throw error;
    }
  },
};
