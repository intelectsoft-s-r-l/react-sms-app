import * as React from "react";
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { ICampaignList } from "api/sms/types";
import moment from "moment";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { Menu, Tag, Modal } from "antd";
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
const SmsTable = (refreshList: () => void, match: any) => {
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
          <Tag className="mr-0">
            {Status === EnSmsType.Draft
              ? "Draft"
              : Status === EnSmsType.Scheduled
              ? "Scheduled"
              : "Executing"}
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
                {/* <Menu.Item
                  key="0"
                  onClick={async () => {
                    Modal.confirm({
                      title: TranslateText("activate.message"),
                      onOk: async () => {
                        return await instance
                          .SMS_UpdateCampaign({
                            ...elm,
                            Status: EnCampaignStatus.ACTIVE,
                          })
                          .then((data) => {
                            if (data && data.ErrorCode === 0) refreshList();
                          });
                      },
                    });
                  }}
                >
                  <CheckCircleOutlined />
                  <span>{TranslateText("activate")}</span>
                </Menu.Item>
                   */}
                <Menu.Item key="2">
                  <Link to={`${match.url}/edit?name=${elm.Name}&id=${elm.ID}`}>
                    <EditOutlined />
                    <span>Edit</span>
                  </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="3"
                  onClick={async () => {
                    return await instance
                      .SMS_DeleteCampaign(elm.ID!)
                      .then((data) => {
                        if (data && data.ErrorCode === 0) {
                          refreshList();
                        }
                      });
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
export default SmsTable;
