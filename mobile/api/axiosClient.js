import axios from "axios";
import { getTokens, removeTokens, saveTokens } from "../utils/tokenUtils";
import { authApi } from "./authApi";
import { endpoints } from "../utils/Apis";
import { errorConsole } from "../utils/errorUtils";

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
      console.info("Gui Access_token", tokens.access_token);
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
        await saveTokens(newAccessToken, tokens.refresh_token);
        originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originRequest);
      } catch (error) {
        await removeTokens();

        errorConsole(error, "axiosclient.interceptor");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
