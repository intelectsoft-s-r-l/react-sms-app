import * as React from "react";
import { Card, Col, Row, Spin } from "antd";
import { SMS_ID } from "constants/ApiConstant";
import { useDispatch, useSelector } from "react-redux";
import { deleteApiKey, generateApiKey } from "redux/actions/App";
import { IState } from "redux/reducers";
import SettingsController from "./SettingsController";

function SettingsForm() {
  const dispatch = useDispatch();
  const APIKey = useSelector((state: IState) => state.app.ApyKey);
  return (
    <Row>
      <Col xs={24} xl={12} xxl={8} md={24}>
        <Card>
          <SettingsController
            name="APIKey"
            title="API Key"
            value={APIKey}
            readOnly
            onSubmit={() => {
              dispatch(generateApiKey(SMS_ID));
            }}
            onDelete={() => dispatch(deleteApiKey(SMS_ID))}
          />
        </Card>
      </Col>
    </Row>
  );
}
export default SettingsForm;
