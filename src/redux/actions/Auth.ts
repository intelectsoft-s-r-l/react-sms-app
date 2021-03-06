import {
  AUTHENTICATED,
  SIGNOUT,
  SHOW_AUTH_MESSAGE,
  HIDE_AUTH_MESSAGE,
  SHOW_LOADING,
  HIDE_LOADING,
  SET_IS_REFRESHING,
} from "redux/constants/Auth";
import { AuthService } from "api/auth";
import { EnErrorCode } from "api";
import { ThunkResult } from "redux/store";
import { AuthorizeUser } from "api/auth/types";
import { getProfileInfo } from "./Account";
import Utils from "utils";
import Cookies from "js-cookie";
import { APP_PREFIX_PATH, DOMAIN } from "configs/AppConfig";

export const authenticated = (token: string) => ({
  type: AUTHENTICATED,
  token,
});

export const setIsRefreshing = (isRefreshing: boolean) => ({
  type: SET_IS_REFRESHING,
  payload: isRefreshing,
});

export const signOut = () => ({
  type: SIGNOUT,
});

export const showAuthMessage = (message: string) => ({
  type: SHOW_AUTH_MESSAGE,
  message,
});

export const hideAuthMessage = () => ({
  type: HIDE_AUTH_MESSAGE,
});

export const showLoading = () => ({
  type: SHOW_LOADING,
});
export const hideLoading = () => ({
  type: HIDE_LOADING,
});

export const authorizeUser = (
  email: string,
  password: string
): ThunkResult<void> => async (dispatch, getState) => {
  return await new AuthService()
    .Login(email, password)
    .then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        Utils.setToken(data.Token);
        window.history.pushState(null, "", APP_PREFIX_PATH);
        window.location.reload();
      } else {
        dispatch(showAuthMessage(data.ErrorMessage.toString()));
      }
    })
    .catch(() => dispatch(hideLoading()))
    .finally(() => dispatch(hideLoading()));
};
