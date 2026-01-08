import { endpoints } from "../utils/Apis";
import axiosClient from "./axiosClient";

async function fetchCourse() {
  try {
    const result = await axiosClient.get(endpoints.courses);
    console.log("NAY har");

    return result ? result : null;
  } catch (error) {
    console.error(error);
  }
}

export default fetchCourse;
