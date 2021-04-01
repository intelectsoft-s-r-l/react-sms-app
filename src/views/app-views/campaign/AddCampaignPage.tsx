import * as React from "react";
import { useState } from "react";
import { Col, PageHeader, Row, Form } from "antd";
import { ROW_GUTTER } from "constants/ThemeConstant";
import Phone from "components/util-components/Phone";
import TranslateText from "utils/translate";
import CampaignForm from "./CampaignForm";
import { MAX_SMS, send } from ".";
import Utils from "utils";
import { SmsService } from "api/sms";
import { EnErrorCode } from "api";
import Loading from "components/shared-components/Loading";
import moment from "moment";

const AddCampaignPage = (props: any) => {
  const [phoneLength, setPhoneLength] = useState<number>(0);
  const [maxPhoneLength, setMaxPhoneLength] = useState<number>(160);
  const [currentSms, setCurrentSms] = useState<number>(1);
  const [form] = Form.useForm();
  const [radioVal, setRadioVal] = useState<number>(2);
  const [date, setDate] = useState<any>();
  const [message, setMessage] = useState<any>(TranslateText("sms.example"));
  const [loading, setLoading] = useState(false);
  const createCampaign = async (values: any) => {
    setLoading(true);
    console.log({
      ...values,
      ScheduledDate: radioVal === send.NOW ? "" : moment(date),
    });
    return await new SmsService()
      .SMS_UpdateCampaign({
        ...values,
        ScheduledDate:
          radioVal !== send.NOW ? Utils.handleDotNetDate(date) : null,
        Status: radioVal,
      })
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          props.history.push(`${props.match.url}/success`);
        }
      });
  };
  const onFinish = async (values: any) => {
    createCampaign(values);
  };
  const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setPhoneLength(e.target.value.length);
    const dynCurrentSms = Math.ceil(e.target.value.length / MAX_SMS);
    setCurrentSms(dynCurrentSms);
    setMaxPhoneLength(MAX_SMS * dynCurrentSms);
    if (e.target.value.length < MAX_SMS) {
      setCurrentSms(1);
      setMaxPhoneLength(MAX_SMS);
    }
  };
  if (loading) return <Loading />;
  return (
    <PageHeader
      title={TranslateText("campaign.add")}
      onBack={() => props.history.push(`${props.match.url}`)}
    >
      <Row gutter={ROW_GUTTER}>
        <Col xxl={16} xl={24} lg={24} md={24}>
          <CampaignForm
            form={form}
            onFinish={onFinish}
            onMessageChange={onMessageChange}
            currentSms={currentSms}
            phoneLength={phoneLength}
            maxPhoneLength={maxPhoneLength}
            radioVal={radioVal}
            setRadioVal={setRadioVal}
            date={date}
            setDate={setDate}
          />
        </Col>
        <Col xxl={8} xl={24} lg={24} md={24}>
          <Phone
            setPhoneLength={setPhoneLength}
            phoneLength={phoneLength}
            maxPhoneLength={maxPhoneLength}
            setMaxPhoneLength={setMaxPhoneLength}
            currentSms={currentSms}
            setCurrentSms={setCurrentSms}
            message={message}
            setMessage={setMessage}
          />
        </Col>
      </Row>
    </PageHeader>
  );
};
export default AddCampaignPage;
