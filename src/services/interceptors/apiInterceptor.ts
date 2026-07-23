import { AxiosInstance, AxiosResponse } from "axios";

export const apiInterceptors = (
    apiClient: AxiosInstance,
    withCredentials = false
) => {
    // Request Interceptor: Ensure standard headers
    apiClient.interceptors.request.use(
        (config) => {
            const isFormData =
                typeof FormData !== "undefined" &&
                config.data instanceof FormData;

            if (!isFormData) {
                config.headers["Content-Type"] = "application/json";
                config.headers["Accept"] = "application/json";
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response Interceptor: Basic network error handling
    apiClient.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error) => {
            const isNetworkError =
                !error.response &&
                (error.code === "ECONNABORTED" ||
                    error.message === "Network Error");

            if (isNetworkError) {
                console.warn("[PokeAPI Network Error] Unable to connect to PokeAPI server");
            } else if (error.response?.status === 404) {
                console.warn("[PokeAPI 404] Resource not found");
            }

            return Promise.reject(error);
        }
    );
};

