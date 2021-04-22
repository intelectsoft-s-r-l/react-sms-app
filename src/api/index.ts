import { message, notification } from "antd";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import { API_AUTH_URL, DOMAIN } from "configs/AppConfig";
import { MANAGE_TOKEN, TOKEN } from "constants/ApiConstant";
import { EXPIRE_TIME } from "constants/Messages";
import Cookies from "js-cookie";
import {
  AUTHENTICATED,
  HIDE_LOADING,
  SET_IS_REFRESHING,
  SIGNOUT,
} from "redux/constants/Auth";
import store from "redux/store";
import Utils from "utils";
import TranslateText from "utils/translate";
import { ApiDecorator, ApiResponse } from "./types";

export enum EnErrorCode {
  INTERNAL_ERROR = -1,
  NO_ERROR = 0,
  APIKEY_NOT_EXIST = 10,
  EXPIRED_TOKEN = 118,
  INCORECT_AUTH_DATA = 102,
  INCORRECT_TOKEN = 105, // Bye-bye!
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
  public token: string | undefined;
  public company_id: any;
  public _source: CancelTokenSource;

  public constructor(baseURL = "") {
    this.instance = axios.create({
      baseURL,
    });
    this._source = axios.CancelToken.source();
    this.company_id = sessionStorage.getItem("c_id");
    this.token = this.company_id
      ? Cookies.get(`${MANAGE_TOKEN}_${this.company_id}`)
      : Cookies.get(TOKEN);
    this._initializeResponseInterceptor();
    this._initializeRequestInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      // @ts-ignore
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

  private setToken = (Token: string) => {
    this.token = Token;
    Utils.setToken(Token);
    this.company_id
      ? Utils.setManageToken(this.company_id, Token)
      : Utils.setToken(Token);
  };
  private _handleRequest = (config: AxiosRequestConfig) => {
    console.log(config);
    return {
      ...config,
      data: { ...config.data, Token: this.token },
      params: { ...config.params, Token: this.token },
      cancelToken: this._source.token,
    };
  };

  private _handleResponse = async (response: AxiosResponse) => {
    console.log(response);
    if (
      response.data &&
      response.data.ErrorCode === EnErrorCode.EXPIRED_TOKEN
    ) {
      return this._handleExpireToken(response);
    } else if (
      response.data &&
      response.data.ErrorCode === EnErrorCode.INTERNAL_ERROR
    ) {
      message.error(`Error: ${response.data.ErrorMessage}`);
    }

    return response.data;
  };

  private _handleExpireToken = async (error: AxiosResponse) => {
    const redirectToLogin = () => {
      const key = "updatable";
      message
        .loading({
          content: TranslateText(EXPIRE_TIME),
          key,
          duration: 1.5,
        })
        .then(() => {
          store.dispatch({ type: SIGNOUT });
        });
    };

    const config = error.config;
    if (!store.getState().auth.isRefreshing) {
      return new Promise((resolve, reject) => {
        store.dispatch({ type: SET_IS_REFRESHING, payload: true });
        console.log(store.getState().auth.isRefreshing);
        axios
          .get(`${API_AUTH_URL}/RefreshToken`, {
            params: { Token: this.token },
          })
          .then(({ data }) => {
            console.log(`Refresh token was called`, data);
            if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
              this.setToken(data.Token);
              resolve(this.instance(config));
            } else {
              redirectToLogin();
            }
          })
          .catch(() => {
            redirectToLogin();
          })
          .finally(() => {
            store.dispatch({ type: SET_IS_REFRESHING, payload: false });
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
          if (!store.getState().auth.isRefreshing) {
            clearInterval(intervalId);
            resolve(this.instance(config));
          }
        }, 100);
      });
    }
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
