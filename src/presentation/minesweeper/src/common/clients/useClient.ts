import apiClient from "./apiClient";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  React.useEffect(() => {
    apiClient.interceptors.request.clear();
    apiClient.interceptors.request.use(async config => {
      try {
        if (!isAuthenticated) return config;
        const accessToken = await getAccessTokenSilently();
        config.headers.set("Authorization", `Bearer ${accessToken}`);
        return config;
      } catch {
        return config;
      }
    });
  }, [getAccessTokenSilently, isAuthenticated]);

  return apiClient;
};
