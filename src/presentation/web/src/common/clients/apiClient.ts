import axios from "axios";
import { apiUrl } from "../../settings";

export default axios.create({
  baseURL: `${apiUrl}/api/v1`
})