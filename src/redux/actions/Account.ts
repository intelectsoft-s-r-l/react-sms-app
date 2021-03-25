import { CLEAR_INFO, UPDATE_SETTINGS } from "redux/constants/Account";

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
