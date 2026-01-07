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
      let res = await authAxios.post(endpoints["login"], {
        username: user.username,
        password: user.password,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "password",
      });
      console.log(CLIENT_ID);
      console.log(CLIENT_SECRET);

      await saveTokens(res.data.access_token, res.data.refresh_token);

      return res;
    } catch (error) {
      console.error("login error || new Client_ID ClientSecret");
      throw error;
    }
  },
};
