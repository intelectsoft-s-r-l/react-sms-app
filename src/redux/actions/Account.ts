import { EnErrorCode } from "api";
import { AuthService } from "api/auth";
import { CLEAR_INFO, UPDATE_SETTINGS } from "redux/constants/Account";
import { IAccount } from "redux/reducers/Account";
import { ThunkResult } from "redux/store";
import { onHeaderNavColorChange, onLocaleChange } from "./Theme";

enum EnLang {
  RO = 0,
  RU = 1,
  EN = 1,
}

export const updateSettings = (payload: any) => ({
  type: UPDATE_SETTINGS,
  payload,
});

export const clearSettings = () => ({
  type: CLEAR_INFO,
});

export const getProfileInfo = (): ThunkResult<void> => async (dispatch) => {
  return await new AuthService().GetProfileInfo().then((data) => {
    if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
      // If it's test environment change header nav color to red
      if (window.location.origin.includes("test"))
        dispatch(onHeaderNavColorChange("#DE4436"));

      dispatch(updateSettings(data.User));
      switch (data.User.UiLanguage) {
        case EnLang.RO:
          dispatch(onLocaleChange("ro"));
          break;
        case EnLang.RU:
          dispatch(onLocaleChange("ru"));
          break;
        default:
          dispatch(onLocaleChange("en"));
      }
    }
  });
};
