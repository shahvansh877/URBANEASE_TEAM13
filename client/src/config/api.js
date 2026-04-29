const DEFAULT_API_URL = "http://localhost:5000/api";

export const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
  const trimmedUrl = configuredUrl.replace(/\/+$/, "");

  return trimmedUrl.endsWith("/api") ? trimmedUrl : `${trimmedUrl}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
