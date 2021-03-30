import * as React from "react";
import { useEffect, useState } from "react";
import { Col, DatePicker, Form, Input, Modal, Row, Upload } from "antd";
import { ICampaignList } from "api/sms/types";
import { ROW_GUTTER } from "constants/ThemeConstant";
import moment from "moment";
import Utils from "utils";
import TranslateText from "utils/translate";
import { SmsService } from "api/sms";
import { UploadChangeParam } from "antd/es/upload/interface";
import { MAX_SMS } from ".";

interface IEditCampaign {
  getCampaignList: () => void;
  data: Partial<ICampaignList>;
  message: string;
  setMessage: any;
  setPhoneLength: any;
}
const EditCampaignForm = ({
  getCampaignList,
  data,
  phoneLength,
  setPhoneLength,
  maxPhoneLength,
  setMaxPhoneLength,
  currentSms,
  setCurrentSms,
  setMessage,
  message,
  history,
  match,
}: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  //const onChange = (info: UploadChangeParam<any>) => {
  //if (info.file.status === "done") {
  //const reader = new FileReader();
  //reader.onload = (e: any) => {
  //let numArr: string = e.target.result
  //.split(/[\s\n\r;*\/]+/)
  //.filter((el: string) => el !== "")
  //.join(",");
  //setPhoneNumbers((prev) => [...prev, numArr]);
  //};
  //reader.readAsText(info.file.originFileObj);
  //}
  //};

  return (
    <Form
      form={form}
      name="editCampaign"
      layout="vertical"
      initialValues={{ ...data, ScheduledDate: moment(data.ScheduledDate) }}
    >
      <Row gutter={ROW_GUTTER}>
        <Col xs={24} sm={24} md={24}>
          <Form.Item label={TranslateText("SMS.CampaignName")} name="Name">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Form.Item
            label={TranslateText("SMS.Description")}
            name="Description"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Form.Item label={TranslateText("SMS.Message")} name="Message">
            <Input.TextArea
              onChange={(e) => {
                setMessage(e.target.value);
                setPhoneLength(e.target.value.length);
                const dynCurrentSms = Math.ceil(
                  e.target.value.length / MAX_SMS
                );
                setCurrentSms(dynCurrentSms);
                setMaxPhoneLength(MAX_SMS * dynCurrentSms);
                if (e.target.value.length < MAX_SMS) {
                  setCurrentSms(1);
                  setMaxPhoneLength(MAX_SMS);
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Form.Item label={TranslateText("receivers")} name="PhoneList">
            <Input.TextArea placeholder={TranslateText("receivers.validate")} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Form.Item
            name={"ScheduledDate"}
            label={TranslateText("SMS.ScheduledDate")}
          >
            <DatePicker format={"DD/MM/YYYY"} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default EditCampaignForm;
