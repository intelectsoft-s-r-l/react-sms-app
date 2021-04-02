import * as React from "react";
import { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { send } from ".";
import moment, { Moment } from "moment";
import TranslateText from "utils/translate";
import { SmsService } from "api/sms";
import { EnErrorCode } from "api";
import { useQuery } from "utils/hooks/useQuery";
import { Col, notification, PageHeader, Result, Row } from "antd";
import { ICampaignList } from "api/sms/types";
import Button from "antd/es/button";
import { Link } from "react-router-dom";
import { ROW_GUTTER } from "constants/ThemeConstant";
import CampaignForm from "./CampaignForm";
import Phone from "components/util-components/Phone";
import Utils from "utils";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import Loading from "components/shared-components/Loading";

function CampaignPage(props: RouteComponentProps) {
  const query = useQuery();
  const [campaign, setCampaign] = useState<ICampaignList | undefined>(
    undefined
  );
  const [textLength, setTextLength] = useState<number>(0);
  const [maxTextLength, setMaxTextLength] = useState<number>(160);
  const [maxAsciiLength, setMaxAsciiLength] = useState<number>(maxTextLength); // It's either 60 or 160
  const [count, setCount] = useState<number>(1); // SMS count
  const [form] = useForm();
  const [date, setDate] = useState<Moment | string>(moment()); // Current date by default
  const [message, setMessage] = useState<any>(TranslateText("sms.example"));
  const [loading, setLoading] = useState<boolean>(false);
  const [radioVal, setRadioVal] = useState<number | undefined>(send.NOW);

  const handleTextCalculation = (text: any) => {
    setMessage(text);
    setTextLength(text.length);
    // If the text length is 170
    // and the max text length is 160 (ASCII text),
    // the count is 2, because 170 / 160 is 1.06 and we ceil the value,
    const currentSmsCount = Math.ceil(text.length / maxAsciiLength);
    setCount(currentSmsCount);
    setMaxTextLength(maxAsciiLength * currentSmsCount);
    if (text.length < maxAsciiLength) {
      setCount(1);
      setMaxTextLength(maxAsciiLength);
    }
  };
  const updateCampaign = async (values: any) => {
    setLoading(true);
    return await new SmsService()
      .SMS_UpdateCampaign({
        ...values,
        ID: query.get("id") ?? values.ID,
        ScheduledDate: Utils.handleDotNetDate(values.ScheduledDate),
        Status: radioVal,
      })
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          props.history.push(props.match.url);
          notification.success({
            message: `Campaign was successfully ${
              query.get("id") ? "edited" : "added"
            }!`,
          });
        }
      });
  };

  const getCampaignInfo = async () => {
    setLoading(true);
    return await new SmsService().SMS_GetCampaign().then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        const currentCampaign = data.CampaignList.find(
          (campaign) => campaign.ID! === +query.get("id")!
        );
        form.setFieldsValue({
          ...currentCampaign,
          ScheduledDate: moment(currentCampaign?.ScheduledDate),
        });
        handleTextCalculation(currentCampaign?.Message);
        setCampaign(currentCampaign);
        setRadioVal(currentCampaign?.Status);
      }
    });
  };

  useEffect(() => {
    if (Utils.isAscii(form.getFieldValue("Message"))) setMaxAsciiLength(160);
    else setMaxAsciiLength(60);
  }, [form.getFieldValue("Message")]);

  useEffect(() => {
    if (query.get("id")) {
      getCampaignInfo();
    }
  }, [query.get("id")]);

  useEffect(() => {
    if (!form.getFieldValue("Name")) {
      form.setFieldsValue({
        Name: `Campaign ${moment().format(DATE_FORMAT_DD_MM_YYYY)}`,
      });
    }
  }, []);

  if (loading) return <Loading />;

  if (!campaign && query.get("id")) {
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
      // If it's edit we show the campaign name
      // else we show `Add campaign` text
      title={`${query.get("id") ? query.get("name") : "Add campaign"}`}
      onBack={() => props.history.push(props.match.url)}
    >
      <Row gutter={ROW_GUTTER}>
        <Col xxl={16} xl={24} lg={24} md={24}>
          <CampaignForm
            form={form}
            onFinish={updateCampaign}
            onMessageChange={(event: any) =>
              handleTextCalculation(event.target.value)
            }
            currentSms={count}
            phoneLength={textLength}
            maxPhoneLength={maxTextLength}
            setRadioVal={setRadioVal}
            radioVal={radioVal}
          />
        </Col>
        <Col xxl={8} xl={24} lg={24} md={24}>
          <Phone
            currentSms={count}
            message={message}
            MAX_SMS={maxAsciiLength}
          />
        </Col>
      </Row>
    </PageHeader>
  );
}
export default CampaignPage;
