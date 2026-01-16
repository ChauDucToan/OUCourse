import axios from "axios";
import { saveTokens } from "../utils/tokenUtils";
import { endpoints } from "../utils/Apis";
import { CLIENT_ID, CLIENT_SECRET } from "@env";

import CryptoJS from "crypto-js";
import { errorConsole } from "../utils/errorUtils";

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
      const secret = user.username + "|" + user.password + "|" + CLIENT_ID;
      let res = await authAxios.post(endpoints["login"], {
        username: user.username,
        password: user.password,
        client_id: CLIENT_ID,
        mac: CryptoJS.HmacSHA256(secret, CLIENT_ID).toString(CryptoJS.enc.Hex),
        grant_type: "password",
      });

      await saveTokens(res.data.access_token, res.data.refresh_token);

      return res;
    } catch (error) {
      errorConsole(error, "authApi:login");
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
      errorConsole(error, "authApi:refresh");
    }
  },
};
