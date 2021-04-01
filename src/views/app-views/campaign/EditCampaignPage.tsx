import * as React from "react";
import { Result, PageHeader, Button, Row, Col, Form, notification } from "antd";
import { useEffect, useState } from "react";
import { EnErrorCode } from "api";
import { ICampaignList } from "api/sms/types";
import { useQuery } from "utils/hooks/useQuery";
import Loading from "components/shared-components/Loading";
import { Link } from "react-router-dom";
import { SmsService } from "api/sms";
import { ROW_GUTTER } from "constants/ThemeConstant";
import Phone from "components/util-components/Phone";
import CampaignForm from "./CampaignForm";
import { MAX_SMS, send } from ".";
import moment from "moment";
import Utils from "utils";

const EditCampaignPage = (props: any) => {
  const query = useQuery(); // name: string, id: string
  const [loading, setLoading] = useState<boolean>(true);
  const [campaign, setCampaign] = useState<ICampaignList | undefined>(
    undefined
  );
  const [phoneLength, setPhoneLength] = useState<number>(0);
  const [maxPhoneLength, setMaxPhoneLength] = useState<number>(160);
  const [currentSms, setCurrentSms] = useState<number>(1);
  const [message, setMessage] = useState<string | undefined>("");
  const [radioVal, setRadioVal] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<any>();
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    setLoading(true);
    return await new SmsService()
      .SMS_UpdateCampaign({
        ...values,
        ScheduledDate: Utils.handleDotNetDate(date),
        Status: radioVal,
        ID: query.get("id"),
      })
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          props.history.push(`${props.match.url}`);
          notification.success({
            message: "Campaign was successfully edited!",
          });
        }
      });
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
  const getCampaignInfo = async () => {
    return await new SmsService().SMS_GetCampaign().then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        const currentCampaign = data.CampaignList.find(
          (campaign) => campaign.ID! === +query.get("id")!
        );
        form.setFieldsValue(currentCampaign);
        setRadioVal(currentCampaign!.Status);
        setDate(moment(currentCampaign?.ScheduledDate));
        setCampaign(currentCampaign);
        setMessage(currentCampaign!.Message ?? "");
      }
    });
  };
  useEffect(() => {
    getCampaignInfo();
  }, []);
  if (loading) {
    return <Loading />;
  }
  if (!campaign) {
    return (
      <Result
        status={"404"}
        title="Campaign not found"
        subTitle="Sorry, the campaign you're trying to reach does not exist."
        extra={
          <Button type="primary">
            <Link to={`${props.match.url}`}>Find your way</Link>
          </Button>
        }
      />
    );
  }
  return (
    <PageHeader
      title={`${query.get("name")}`}
      onBack={() => props.history.push(props.match.url)}
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
            message={message}
            setMessage={setMessage}
            setPhoneLength={setPhoneLength}
            phoneLength={phoneLength}
            maxPhoneLength={maxPhoneLength}
            setMaxPhoneLength={setMaxPhoneLength}
            currentSms={currentSms}
            setCurrentSms={setCurrentSms}
          />
        </Col>
      </Row>
    </PageHeader>
  );
};

export default EditCampaignPage;
