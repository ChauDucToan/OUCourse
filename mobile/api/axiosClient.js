import axios from "axios";
import { getTokens, removeTokens } from "../utils/tokenUtils";
import { authApi } from "./authApi";
import { endpoints } from "../utils/Apis";

const axiosClient = axios.create({
  baseURL: endpoints.baseUrl,
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
    if (error.response?.status === 401 && !originRequest._retry) {
      originRequest._retry = true;
      try {
        const tokens = await getTokens();
        if (!tokens || !tokens.refresh_token) {
          return;
        }

        const res = await authApi.refresh(tokens.refresh_token);
        const newAccessToken = res.access_token;
        await saveTokens({ ...tokens, access_token: newAccessToken });
        originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originRequest);
      } catch (error) {
        console.error("Interceptors-respone: ", error.message);
        await removeTokens();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
