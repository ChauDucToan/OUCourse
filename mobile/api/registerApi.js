import { endpoints } from "../utils/Apis";
import axiosClient from "./axiosClient";

export const registerApi = {
  register: async (formData) => {
    let res = await axiosClient.post(endpoints["register"], formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res;
  },
};
