import { ResponseType } from "axios";

export interface ApiClient<T = any> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: T;
  params?: Record<string, any>;
  responseType?: ResponseType;
}
