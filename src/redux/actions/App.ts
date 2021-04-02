import { EnErrorCode } from "api";
import { PortalService } from "api/client";
import { SMS_ID } from "constants/ApiConstant";
import { UPDATE_APP } from "redux/constants/App";
import { ThunkResult } from "redux/store";
import { hideLoading, showLoading } from "./Auth";

const noAPIKey = "00000000-0000-0000-0000-000000000000";
export const updateApp = (payload: any) => ({
  type: UPDATE_APP,
  payload,
});

export const getAppInfo = (): ThunkResult<void> => async (dispatch) => {
  return await new PortalService().GetAppInfo().then((data) => {
    if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
      const smsApp = data.MarketAppList.find((app) => app.ID === SMS_ID);
      dispatch(updateApp(smsApp));
      return smsApp;
    }
  });
};

export const generateApiKey = (AppID: number): ThunkResult<void> => async (
  dispatch
) => {
  dispatch(showLoading());
  return await new PortalService().GenerateApiKey(AppID).then((data) => {
    dispatch(hideLoading());
    if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
      dispatch(updateApp({ ApyKey: data.ApiKey }));
    }
  });
};

export const deleteApiKey = (AppID: number): ThunkResult<void> => async (
  dispatch
) => {
  dispatch(showLoading());
  return await new PortalService().DeleteApiKey(AppID).then((data) => {
    dispatch(hideLoading());
    if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
      dispatch(updateApp({ ApyKey: noAPIKey }));
    }
  });
};
