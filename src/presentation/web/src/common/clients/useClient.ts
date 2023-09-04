import axios from "axios";
import apiClient from "./apiClient";
import { useAuth0 } from "@auth0/auth0-react";


export default () => {
  const { getAccessTokenSilently } = useAuth0();
  
  apiClient.interceptors.request.clear();  
  apiClient.interceptors.request.use(async config => {
    try {
      const accessToken = await getAccessTokenSilently()
      config.headers.set("Authorization", `Bearer ${accessToken}`);
      return config;
    } catch {
      return config;
    }
  });

  return apiClient;
}