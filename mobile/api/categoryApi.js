import { endpoints } from "../utils/Apis";
import request from "./fetchApi";

async function fetchCategory() {
  const result = await request(endpoints.baseUrl + endpoints.categories);
  return result ? result : null;
}
export default fetchCategory;
