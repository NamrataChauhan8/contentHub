import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import apiClient from "../lib/apiClient";

export type RequestType =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "postFormData";

export type ApiErrorPayload = {
  status: number;
  message: string;
  data?: unknown;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;
  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = payload.status;
    this.data = payload.data;
  }
}

type ApiOptions = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeoutMs?: number;
  authToken?: string | null;
  onUploadProgress?: AxiosRequestConfig["onUploadProgress"];
  baseURL?: string;
};

let globalAuthTokenGetter:
  | (() => Promise<string | null> | string | null)
  | null = null;

export function setGlobalAuthTokenGetter(
  getter: () => Promise<string | null> | string | null
) {
  globalAuthTokenGetter = getter;
}

function buildAxiosConfig(
  method: Method,
  url: string,
  data: unknown,
  options: ApiOptions
): AxiosRequestConfig {
  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
  };

  // Let callers pass in a bearer token if they use an external API.
  if (options.authToken) {
    headers["Authorization"] = `Bearer ${options.authToken}`;
  }

  const config: AxiosRequestConfig = {
    method,
    url,
    baseURL:
      options.baseURL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? undefined,
    data,
    params: options.params,
    headers,
    timeout: options.timeoutMs,
    onUploadProgress: options.onUploadProgress,
    withCredentials: true,
  };

  return config;
}

export async function apiRequest<T = unknown>(
  type: RequestType,
  url: string,
  payload?: unknown,
  options: ApiOptions = {}
): Promise<T> {
  // If no explicit token provided and a global getter exists, resolve it
  if (!options.authToken && globalAuthTokenGetter) {
    const maybeToken = await Promise.resolve(globalAuthTokenGetter());
    if (maybeToken) options.authToken = maybeToken;
  }

  let data: unknown = payload;

  if (type === "postFormData") {
    if (!(payload instanceof FormData)) {
      const form = new FormData();
      if (payload && typeof payload === "object") {
        Object.entries(payload as Record<string, unknown>).forEach(
          ([key, value]) => {
            if (value !== undefined && value !== null) {
              form.append(key, value as string | Blob);
            }
          }
        );
      }
      data = form;
    }
    // Let browser set correct Content-Type boundary
    options.headers = { ...(options.headers ?? {}) };
    delete options.headers["Content-Type"];
  }

  const method: Method =
    type === "postFormData" ? "post" : (type as unknown as Method);

  try {
    const config = buildAxiosConfig(method, url, data, options);
    const response: AxiosResponse<T> = await apiClient.request<T>(config);

    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    const status = error.response?.status ?? 0;
    const message =
      (error.response?.data as { message: string })?.message ||
      error.message ||
      "Request failed";
    const data = error.response?.data;
    throw new ApiError({ status, message, data });
  }
}

export const api = {
  get: <T>(url: string, options?: ApiOptions) =>
    apiRequest<T>("get", url, undefined, options),
  post: <T>(url: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>("post", url, body, options),
  put: <T>(url: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>("put", url, body, options),
  patch: <T>(url: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>("patch", url, body, options),
  delete: <T>(url: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>("delete", url, body, options),
  postFormData: <T>(url: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>("postFormData", url, body, options),
};

export async function apiSimple<T = unknown>(
  endpoint: string,
  payload?: unknown,
  method: RequestType = "get",
  options: ApiOptions = {}
): Promise<T> {
  if (method === "get" || method === "delete") {
    const paramsOptions: ApiOptions = {
      ...options,
      params: payload as Record<string, unknown>,
    };
    return apiRequest<T>(method, endpoint, undefined, paramsOptions);
  }
  return apiRequest<T>(method, endpoint, payload, options);
}

export default apiSimple;
