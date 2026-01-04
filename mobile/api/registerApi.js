import axios from "axios";
import { endpoints } from "../utils/Apis";

const registerAxios = axios.create({
  baseURL: endpoints.baseUrl,
  headers: {
    // Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});
export const registerApi = {
  register: async (formData) => {
    try {
      console.log(formData._parts);
      let res = await registerAxios.post(endpoints["register"], formData);
      return res;
    } catch (error) {
      console.error("register error");
      // console.error("Error request:", error.request);
      throw error;
    }
  },
};
