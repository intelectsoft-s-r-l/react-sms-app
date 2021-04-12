import * as React from "react";
import { useState, useEffect } from "react";
import { message, Spin } from "antd";
import { useSelector } from "react-redux";
import { IState } from "redux/reducers";
import SettingsForm from "./SettingsForm";
import { PortalService } from "api/client";
import { EnErrorCode } from "api";
import { SMS_ID } from "constants/ApiConstant";
function Settings() {
  const loading = useSelector((state: IState) => state.auth?.loading);
  const portal = new PortalService();
  const [apiKey, setApiKey] = useState<string>("");
  const getAppInfo = async () => {
    return await portal.GetAppInfo().then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        const smsApp = data.MarketAppList.find((app) => app.ID === SMS_ID);
        setApiKey(smsApp!.ApyKey!);
      }
    });
  };
  const generateApiKey = async () => {
    return await portal.GenerateApiKey(SMS_ID).then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        message.success("API Key was generated!");
      }
    });
  };

  const deleteApiKey = async () => {
    return await portal.DeleteApiKey(SMS_ID).then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        message.success("API Key was deleted!");
      }
    });
  };
  useEffect(() => {
    getAppInfo();
  }, []);
  return (
    <Spin spinning={loading}>
      <SettingsForm
        APIKey={apiKey}
        generateApiKey={generateApiKey}
        deleteApiKey={deleteApiKey}
      />
    </Spin>
  );
}
export default Settings;
