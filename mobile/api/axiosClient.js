import axios from "axios";

import { BASE_URL } from "@env";
import { getTokens, removeTokens } from "../utils/tokenUtils";
import { authApi } from "./authApi";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    if (tokens && tokens.access_token) {
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originRequest = error.config;
    if (!originRequest._retry) {
      originRequest._retry = true;
      try {
        const tokens = await getTokens();
        if (!tokens || !tokens.refresh_token) {
          throw new Error("Không có refresh token");
        }

        const res = await authApi.refresh(tokens.refresh_token);
        const newAccessToken = res.access_token;
        originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originRequest);
      } catch (error) {
        console.error("refresh token lỗi: ", error);
        await removeTokens();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
