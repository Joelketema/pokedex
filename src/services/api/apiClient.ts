import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiClient } from "../../interfaces/ApiClient";
import { API_URL } from "../../const";
import { apiInterceptors } from "../interceptors/apiInterceptor";

export const apiClient = async <T = any, R = any>(
    data: ApiClient<T>,
    withCredentials = false
): Promise<AxiosResponse<R>> => {
    // If url is absolute (e.g. starts with http), baseURL won't override it, but for endpoint paths it builds `${API_URL}/${data?.url}`
    const isAbsoluteUrl = data?.url.startsWith("http://") || data?.url.startsWith("https://");
    const baseURL = isAbsoluteUrl ? "" : API_URL;
    const url = isAbsoluteUrl ? data.url : data.url ? `${data.url}` : "";

    const axiosInstance: AxiosInstance = axios.create({
        baseURL,
    });

    apiInterceptors(axiosInstance, withCredentials);

    const options = {
        url,
        method: data?.method || "GET",
        data: data.data,
        params: data.params,
        responseType: data.responseType || "json",
    } as any;

    return axiosInstance.request<R>(options);
};
