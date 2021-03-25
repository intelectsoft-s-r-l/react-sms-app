import { message } from "antd";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import { HIDE_LOADING } from "redux/constants/Auth";
import store from "redux/store";

export enum EnErrorCode {
  INTERNAL_ERROR = -1,
  NO_ERROR = 0,
  APIKEY_NOT_EXIST = 10,
  EXPIRED_TOKEN = 118,
  INCORECT_AUTH_DATA = 102,
}
export enum EnReqStatus {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

declare module "axios" {
  interface AxiosResponse<T> extends Promise<T> {}
}

class HttpService {
  public readonly instance: AxiosInstance;
  private _token: string;
  public _source: CancelTokenSource;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });
    this._source = axios.CancelToken.source();
    this._token = store.getState().auth.token;
    this._initializeResponseInterceptor();
    this._initializeRequestInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };
  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest,
      this._handleRequestError
    );
  };

  private _handleRequest = (config: AxiosRequestConfig) => {
    console.log(config);
    return {
      ...config,
      data: { ...config.data, Token: this._token },
      params: { ...config.params, Token: this._token },
      cancelToken: this._source.token,
    };
  };

  private _handleResponse = (response: AxiosResponse) => {
    console.log(response);
    return response.data;
  };
  private _handleError = async (error: AxiosResponse) => {
    store.dispatch({ type: HIDE_LOADING });
    if (error && error.request && error.request.status !== EnReqStatus.OK) {
      message.error({
        content: error.toString(),
        key: "updatable",
        duration: 2.5,
      });
    }
  };
  private _handleRequestError = (error: any) => Promise.reject(error);
}
export default HttpService;
