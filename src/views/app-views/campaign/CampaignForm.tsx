import * as React from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Select,
  Form,
  Input,
  Radio,
  Row,
} from "antd";
import { ROW_GUTTER } from "constants/ThemeConstant";
import TranslateText from "utils/translate";
import { send } from ".";
import moment from "moment";
import Utils from "utils";
import SelectReceivers from "./SelectReceivers";
export const rules = {
  Name: [
    {
      required: true,
      message: "Please input a campaign name!",
    },
  ],
  Description: [
    {
      required: false,
      message: "Please input a short description!",
    },
  ],
  Message: [
    {
      required: true,
      message: "Please input a message!",
    },
  ],
  PhoneList: [
    {
      required: false,
      message: "Please input a phone list!",
    },
    {
      pattern: /^\d+(,\d+)*$/,
      message: "Numbers should be followed by comma",
    },
  ],
  ScheduledDate: [
    {
      required: false,
      message: "Please insert a scheduled date!",
    },
  ],
};
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};
function CampaignForm({
  form,
  onFinish,
  onMessageChange,
  currentSms,
  phoneLength,
  maxPhoneLength,
  radioVal,
  setRadioVal,
  phones,
  setPhones,
}: any) {
  return (
    <Card>
      <Form
        form={form}
        name="newCampaign"
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={TranslateText("campaign.name")}
              name="Name"
              rules={rules.Name}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={TranslateText("description")}
              name="Description"
              rules={rules.Description}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={TranslateText("message")}
              name="Message"
              rules={rules.Message}
              extra={
                <small>
                  <b>{currentSms}</b> SMS {`(${phoneLength}/${maxPhoneLength})`}
                </small>
              }
            >
              <Input.TextArea onChange={onMessageChange} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item
              label={TranslateText("receivers")}
              name="PhoneList"
              rules={rules.PhoneList}
            >
              <SelectReceivers
                form={form}
                phones={phones}
                setPhones={setPhones}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <div className="mb-3">
              <Radio.Group
                value={radioVal}
                onChange={(e) => setRadioVal(e.target.value)}
              >
                <Radio style={radioStyle} value={send.NOW}>
                  {TranslateText("immediately")}
                </Radio>
                <Radio style={radioStyle} value={send.DELAY}>
                  {TranslateText("delay.sms.send")}
                </Radio>
              </Radio.Group>
            </div>
            <Form.Item
              name="ScheduledDate"
              className={`${radioVal === send.DELAY ? "" : "d-none"}`}
              initialValue={moment(Date.now())}
            >
              <DatePicker
                format={"DD/MM/YYYY"}
                disabledDate={(current) =>
                  current && current.valueOf() < Date.now()
                }
              />
            </Form.Item>
            <Form.Item>
              <div>
                <Button type="primary" htmlType="submit" className="mr-3">
                  {TranslateText("save")}
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
export default CampaignForm;
