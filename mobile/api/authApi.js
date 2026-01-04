import axios from "axios";
import { saveTokens } from "../utils/tokenUtils";
import { endpoints } from "../utils/Apis";
import { CLIENT_ID, CLIENT_SECRET, BASE_URL_1 } from "@env";
const authAxios = axios.create({
  baseURL: BASE_URL_1,
});

export const authApi = {
  login: async (user) => {
    try {
      const params = new URLSearchParams();
      params.append("username", user.username);
      params.append("password", user.password);
      params.append("client_id", CLIENT_ID);
      params.append("client_secret", CLIENT_SECRET);
      params.append("grant_type", "password");
      console.log(params.toString());
      console.log(BASE_URL_1);
      console.log(endpoints["login"]);
      let res = await authAxios.post(endpoints["login"], {
        ...user,
        client_id: "4jr0cMT5CiZAW3ZAaW5Sx3Ex9JC1yNjnK34k85ga", // Lưu vào biến môi trường của react
        client_secret:
          "2gYKjItC9dWyLTpzodprh8P3Pk8TUgkyOuSB1JmVMH3wW6s3e4HgvIw9QGkY7M2w5xLNY1TxMB3pWxPYv0MkmBOMAlYM9PKrPwYdZ9SBEgEZrbg3gbctt5LF965qMNEh", // Lưu vào biến môi trường của react
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
