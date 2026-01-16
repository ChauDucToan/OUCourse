import { endpoints } from "../utils/Apis";
import { errorConsole } from "../utils/errorUtils";
import axiosClient from "./axiosClient";

async function fetchCourse() {
  try {
    const result = await axiosClient.get(endpoints.courses);
    return result ? result : null;
  } catch (error) {
    errorConsole(error, "fetchCourse");
  }
}

export default fetchCourse;
