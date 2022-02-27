import { injectable } from "inversify";
import { IRequestService } from "@think/domains";
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { Toast } from "@douyinfe/semi-ui";
import Router from "next/router";

export const axiosInstance = axios.create({
  baseURL: process.env.SERVER_API_URL,
  timeout: 60000,
});

const isBrowser = typeof window !== "undefined";

axiosInstance.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = window.localStorage.getItem("token");
      if (config && config.headers && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  () => {
    throw new Error("There is an error occured when building a request");
  }
);

axiosInstance.interceptors.response.use(
  (data) => {
    if (data.status && +data.status === 200 && data.data.status === "error") {
      isBrowser && Toast.error(data.data.message);
      return null;
    }

    const res = data.data;

    if (!res.success) {
      isBrowser && Toast.error(res.msg);
      return null;
    }

    return res.data;
  },
  (err) => {
    if (err && err.response && err.response.status) {
      const status = err.response.status;

      switch (status) {
        case 504:
        case 404:
          isBrowser &&
            Toast.error(
              (err.response &&
                err.response.data &&
                err.response.data.message) ||
                "服务器异常"
            );
          break;
        case 401:
          if (isBrowser) {
            Router.replace(`/login?redirect=${window.location.pathname}`);
          }
          break;

        default:
          isBrowser &&
            Toast.error(
              (err.response &&
                err.response.data &&
                err.response.data.message) ||
                "未知错误!"
            );
      }

      return Promise.reject({
        statusCode: err.response.status,
        message: err.response.data.message,
      });
    }

    return Promise.reject(err);
  }
);

@injectable()
export class RequestService implements IRequestService {
  private request: AxiosInstance = axiosInstance;

  async get<T = never, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig<T>
  ): Promise<R> {
    return this.request.get(url, config);
  }

  async post<T = never, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig<T>
  ): Promise<R> {
    return this.request.post(url, data, config);
  }

  async put<T = never, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig<T>
  ): Promise<R> {
    return this.request.put(url, data, config);
  }

  async patch<T = never, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig<T>
  ): Promise<R> {
    return this.request.patch(url, data, config);
  }

  async delete<T = never, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig<T>
  ): Promise<R> {
    return this.request.delete(url);
  }
}
