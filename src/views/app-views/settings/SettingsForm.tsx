import * as React from "react";
import { Card, Col, Row } from "antd";
import { SMS_ID } from "constants/ApiConstant";
import { useDispatch } from "react-redux";
import SettingsController from "./SettingsController";

interface ISettingsForm {
  APIKey: string;
  generateApiKey: (id: number) => void;
  deleteApiKey: (id: number) => void;
}
function SettingsForm({ APIKey, generateApiKey, deleteApiKey }: ISettingsForm) {
  const dispatch = useDispatch();
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
