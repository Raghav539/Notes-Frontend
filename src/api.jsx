import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8080/", 
});

// Add access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh expired token automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized & not retried yet → try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token");

        const res = await axios.post("http://127.0.0.1:8080/api/users/token/refresh/", {
          refresh,
        });

        const newAccess = res.data.access;
        localStorage.setItem("token", newAccess);

        // update header & retry request
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (err) {
        console.error("Refresh failed, logging out");
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
