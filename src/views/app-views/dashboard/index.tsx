import * as React from "react";
import { CSVDownload, CSVLink } from "react-csv";
import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  Col,
  DatePicker,
  Row,
  Table,
  Tag,
  Button,
  Tooltip,
} from "antd";
import { RouteComponentProps } from "react-router-dom";
import { SmsService } from "api/sms";
import DonutChartWidget from "components/shared-components/DonutChartWidget";
import Flex from "components/shared-components/Flex";
import { COLORS } from "constants/ChartConstant";
import { ROW_GUTTER } from "constants/ThemeConstant";
import moment from "moment";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { ISmsList } from "api/sms/types";
import { ColumnsType } from "antd/es/table/interface";
import TranslateText from "utils/translate";
// @ts-ignore
import shortid from "shortid";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "redux/reducers";
import { PortalService } from "api/client";
import { EnErrorCode } from "api";

enum EnSmsType {
  INFO = 0,
  ADS = 1,
}

enum EnSmsState {
  Pending = 0,
  DeliverySuccessful = 1,
  FailedDelivery = 2,
  MessageBuffered = 3,
  AcceptedSmsc = 8,
  RejectedSmsc = 16,
  DeliveryToBulkSMS = 100,
}

const tableColumns: ColumnsType<ISmsList> = [
  {
    title: TranslateText("phone"),
    dataIndex: "Phone",
    render: (Phone) => <span>{Phone}</span>,
  },
  {
    title: TranslateText("sent.date"),
    dataIndex: "SentDate",
  },
  {
    title: TranslateText("message.type"),
    dataIndex: "MessageType",
    render: (MessageType) => (
      <Tag className="text-capitalize">{MessageType}</Tag>
    ),
  },
  {
    title: TranslateText("message"),
    dataIndex: "Message",
    render: (Message: string) => (
      <Tooltip title={Message.length > 25 && Message}>
        <div style={{ width: 200, cursor: "pointer" }}>
          <p
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              margin: 0,
              padding: 0,
            }}
          >
            {Message}
          </p>
        </div>
      </Tooltip>
    ),
  },
  {
    title: TranslateText("quantity"),
    dataIndex: "Quantity",
  },
];
const SmsDashboard = () => {
  const instance = new SmsService();

  const [date, setDate] = useState<any>([
    moment().clone().startOf("month"),
    moment().clone().endOf("month"),
  ]);

  const [smsInfo, setSmsInfo] = useState<{ title: string; value: number }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [smsList, setSmsList] = useState<any>([]);
  const [totalSms, setTotalSms] = useState<number>(0);
  const [statusData, setStatusData] = useState<any>([]);
  const [csvData, setCsvData] = useState<any>([]);
  const statusColor = [COLORS[1], COLORS[2], COLORS[3], COLORS[6]];
  const statusLabels = [
    TranslateText("sent"),
    TranslateText("failed"),
    TranslateText("rejected"),
    TranslateText("waiting"),
  ];
  const onChange = async (value: any) => {
    setDate([value[0], value[1]]);
    await getSmsList(
      value[0].format("DD-MM-YYYY"),
      value[1].format("DD-MM-YYYY")
    );
  };
  const getSmsList = async (
    // give default values
    firstDate = date[0].format("DD-MM-YYYY"),
    secondDate = date[1].format("DD-MM-YYYY")
  ) => {
    return await instance
      .Info_GetDetailByPeriod(firstDate, secondDate)
      .then((data) => {
        setLoading(false);
        if (data?.ErrorCode === EnErrorCode.NO_ERROR) {
          setSmsList(data.SMSList);
          setCsvData(
            data.SMSList.map((elem) => {
              elem.SentDate = moment
                .unix(+elem.SentDate.slice(6, 16))
                .format("DD-MM-YYYY");
              elem.Created = moment
                .unix(+elem.Created.slice(6, 16))
                .format("DD-MM-YYYY");
              elem.MessageType =
                elem.MessageType === EnSmsType.INFO
                  ? TranslateText("SMS.Informational")
                  : TranslateText("SMS.Ad");
              // @ts-ignore
              delete elem["State"];
              return elem;
            })
          );
          setTotalSms(data.TotalSMS);
        }
      });
  };
  const getSmsInfo = async () => {
    return instance.Info_GetTotal().then(async (data) => {
      if (data?.ErrorCode === EnErrorCode.NO_ERROR) {
        setStatusData([
          data.SentThisMonth,
          data.FailedDelivery,
          data.Rejected,
          data.WaitingForSend,
        ]);
        setSmsInfo([
          { title: TranslateText("today"), value: data.SentToday },
          { title: TranslateText("week"), value: data.SentThisWeek },
          { title: TranslateText("month"), value: data.SentThisMonth },
        ]);
      }
    });
  };
  useEffect(() => {
    Promise.all([getSmsInfo(), getSmsList()]);
    return () => instance._source.cancel();
  }, []);

  const jointStatusData = () => {
    let arr: any = [];
    for (let i = 0; i < statusData.length; i++) {
      const data = statusData[i];
      const label = statusLabels[i];
      const color = statusColor[i];
      arr = [
        ...arr,
        {
          data,
          label,
          color,
        },
      ];
    }
    return arr;
  };

  return (
    <>
      {/*<h5 className="mb-4">{TranslateText("latest")}</h5> */}
      <Row className="my-4" gutter={ROW_GUTTER}>
        <Col xs={24} sm={24} md={24} lg={24} xxl={16}>
          <Row gutter={ROW_GUTTER}>
            {smsInfo.map((elm: any, i: any) => (
              <Col xs={24} sm={24} md={24} lg={24} xl={8} key={i}>
                <StatisticWidget title={elm.title} value={elm.value} />
              </Col>
            ))}
          </Row>
          <Row gutter={ROW_GUTTER}>
            <Col span={24}>
              <Card
                title={`${TranslateText("list")} - ${totalSms}`}
                extra={
                  <>
                    <DatePicker.RangePicker
                      format={"DD-MM-YYYY"}
                      defaultValue={date}
                      onChange={onChange}
                    />
                    <Tooltip title="CSV format">
                      <Button type="primary" className="ml-3">
                        <CSVLink filename="my-sms.csv" data={csvData}>
                          {TranslateText("download")}
                        </CSVLink>
                      </Button>
                    </Tooltip>
                  </>
                }
              >
                <Table
                  className="no-border-last"
                  columns={tableColumns}
                  dataSource={smsList}
                  rowKey={shortid.generate()}
                  loading={loading}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xxl={8}>
          <DonutChartWidget
            series={statusData}
            labels={statusLabels}
            title={TranslateText("status")}
            customOptions={{ colors: statusColor }}
            extra={
              <Row justify="center">
                <Col xs={20} sm={20} md={20} lg={24}>
                  <div className="mt-4 mx-auto" style={{ maxWidth: 200 }}>
                    {jointStatusData().map((elm: any) => (
                      <Flex
                        alignItems="center"
                        justifyContent="between"
                        className="mb-3"
                        key={elm.label}
                      >
                        <div>
                          <Badge color={elm.color} />
                          <span className="text-gray-light">{elm.label}</span>
                        </div>
                        <span className="font-weight-bold text-dark">
                          {elm.data}
                        </span>
                      </Flex>
                    ))}
                  </div>
                </Col>
              </Row>
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default SmsDashboard;
