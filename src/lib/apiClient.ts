// interceptor.ts
import axios from "axios";

const apiClient = axios.create({
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const reqUrl: string = error?.config?.url || "";

    // Don't trigger a redirect loop for the auth-check endpoint
    const isAuthCheck = reqUrl.endsWith("/api/me") || reqUrl.includes("/api/auth/session");

    if (status === 401 && !isAuthCheck) {
      // for non-auth-check requests, redirect to homepage
      window.location.assign("/");
    }

    if (status === 403) {
      window.location.assign("/e403");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
