import { BASE_URL } from "../../const";
import { AxiosInstance, AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";

export const apiInterceptors = (
    apiClient: AxiosInstance,
    withCredentials: boolean
) => {
    apiClient.interceptors.request.use(
        (config) => {
            const requestId = uuidv4();
            const isFormData =
                typeof FormData !== "undefined" &&
                config.data instanceof FormData;

            if (!isFormData) {
                config.headers["Content-Type"] = "application/json";
            }

            config.headers["X-api-key"] = "1000001";
            config.headers["X-REQUEST-ID"] = requestId;
            config.headers["X-api-client-id"] = "1001";

            if (withCredentials) {
                // In React Native / Expo, token management can read from secure storage
                const token = null;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

            if (
                config.method?.toUpperCase() === "POST" &&
                config.data &&
                typeof config.data === "object" &&
                !isFormData
            ) {
                config.data = {
                    ...config.data,
                    api: "string",
                    appName: "PokemonApp",
                    appVersion: "1.0.0",
                    language: "en",
                    apiRequestId: requestId,
                };
            }

            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    apiClient.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error) => {
            const isNetworkError =
                !error.response &&
                (error.code === "ECONNABORTED" ||
                    error.message === "Network Error");

            if (isNetworkError || error?.message === "Network Error") {
                console.warn("[Network Error] No internet or server unreachable");
            }

            if (error.response?.status === 401) {
                console.warn("[Unauthorized] Session expired or invalid key");
            }

            return Promise.reject(error);
        }
    );
};
