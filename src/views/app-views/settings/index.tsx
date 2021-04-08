import * as React from "react";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import { IState } from "redux/reducers";
import SettingsForm from "./SettingsForm";
function Settings() {
  const loading = useSelector((state: IState) => state.auth?.loading);
  return (
    <Spin spinning={loading}>
      <SettingsForm />
    </Spin>
  );
}
export default Settings;
