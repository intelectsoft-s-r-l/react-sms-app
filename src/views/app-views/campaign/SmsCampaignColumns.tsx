import * as React from "react";
import {
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { ICampaignList } from "api/sms/types";
import moment from "moment";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { Menu, Tag } from "antd";
import { Link } from "react-router-dom";
import TranslateText from "utils/translate";
import Utils from "utils";
import { SmsService } from "api/sms";

export enum EnSmsType {
  Draft = 0,
  Scheduled = 1,
  Instant = 2,
}
// de la 9:00 pana la 18:00
export enum EnCampaignStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}
const CampaignColumns = (
  match: any,
  deleteCampaign: (id: number) => void,
  cancelCampaign: (id: number) => void
) => {
  const getDaysLeft = (date: string) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    const scheduledDate = moment(date);
    return Math.round(Math.abs((+today - +scheduledDate) / oneDay));
  };
  const instance = new SmsService();
  const tableColumns: ColumnsType<ICampaignList> = [
    {
      title: TranslateText("campaign.name"),
      dataIndex: "Name",
    },
    {
      title: TranslateText("create.date"),
      dataIndex: "CreateDate",
      render: (date) => <span>{Utils.fromDotNetDate(date)}</span>,
    },
    {
      title: TranslateText("scheduled.date"),
      dataIndex: "ScheduledDate",
      render: (date) => <span>{Utils.fromDotNetDate(date)}</span>,
    },
    {
      title: TranslateText("status"),
      dataIndex: "Status",
      render: (Status: number) => (
        <div>
          <Tag
            className="mr-0"
            color={Status === EnSmsType.Instant ? "green" : "orange"}
          >
            {Status === EnSmsType.Draft
              ? "Draft"
              : Status === EnSmsType.Scheduled
              ? "Scheduled"
              : "Executed"}
          </Tag>
        </div>
      ),
    },
    {
      title: TranslateText("contacts"),
      render: (_, elm) => (
        <span>{elm.PhoneList ? elm.PhoneList!.split(",").length : 0}</span>
      ),
    },
    {
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown
            menu={
              <Menu>
                {/* {elm.Status === EnSmsType.Scheduled ||
                elm.Status === EnSmsType.Instant ? (
                  <>
                    <Menu.Item key="1" onClick={() => cancelCampaign(elm.ID!)}>
                      <CloseCircleOutlined />
                      <span>{TranslateText("cancel")}</span>
                    </Menu.Item>
                    <Menu.Divider />
                  </>
                ) : (
                  <>
                    <Menu.Item key="2">
                      <Link
                        to={`${match.url}/edit?name=${elm.Name}&id=${elm.ID}`}
                      >
                        <EditOutlined />
                        <span>{TranslateText("edit")}</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Divider />
                  </>
                )} */}
                <Menu.Item
                  key="3"
                  onClick={() => {
                    deleteCampaign(elm.ID!);
                  }}
                >
                  <DeleteOutlined />
                  <span>{TranslateText("delete")}</span>
                </Menu.Item>
              </Menu>
            }
          />
        </div>
      ),
    },
  ];

  return tableColumns;
};
export default CampaignColumns;
