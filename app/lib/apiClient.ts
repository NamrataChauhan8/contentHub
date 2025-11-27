import axios from "axios";

const apiClient = axios.create({
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if ([401].includes(status)) {
      window.location.assign("/api/auth/signout?callbackUrl=/api/auth/signin");
    }

    if ([403].includes(status)) {
      window.location.assign("/e403");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
