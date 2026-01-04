import { endpoints } from "../utils/Apis";
import request from "./fetchApi";

async function fetchCourse() {
  const result = await request(endpoints.baseUrl + endpoints.courses);
  console.log("RES: ", result);
  return result ? result : null;
}

export default fetchCourse;
