export const apiUrl: string  = process.env.REACT_APP_API_URL || "";
export const baseDateMilliseconds = new Date(2023, 0, 1).valueOf();
export const authConfig = {
  domain: process.env.REACT_APP_AUTH_DOMAIN || "",
  clientId: process.env.REACT_APP_AUTH_CLIENT_ID || "",
  audience: process.env.REACT_APP_AUTH_AUDIENCE || ""
}