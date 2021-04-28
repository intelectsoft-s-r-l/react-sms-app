import * as React from "react";
import { Button, Input, Table, Modal } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import Flex from "components/shared-components/Flex";
import CampaignColumns from "./SmsCampaignColumns";
import { Link, RouteComponentProps } from "react-router-dom";
import TranslateText from "utils/translate";
import Utils from "utils";
import { SmsService } from "api/sms";
import { ICampaignList } from "api/sms/types";
import { EnErrorCode } from "api";

const CampaignList = ({ match }: RouteComponentProps) => {
  const instance = new SmsService();
  const [campaignInfo, setCampaignInfo] = useState<ICampaignList[]>([]);
  const [campaignListToSearch, setCampaignListToSearch] = useState<
    ICampaignList[]
  >([]);
  const [selectedCampaign, setSelectedCampaign] = useState<
    Partial<ICampaignList>
  >({});
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const getCampaignList = async (): Promise<any> => {
    return await instance.SMS_GetCampaign().then((data) => {
      setTableLoading(false);
      if (data && data.ErrorCode === 0) {
        setCampaignListToSearch(data.CampaignList);
        setCampaignInfo(data.CampaignList);
      }
    });
  };
  const deleteCampaign = async (id: number) => {
    setTableLoading(true);
    return await instance.SMS_DeleteCampaign(id).then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        getCampaignList();
      }
    });
  };

  const cancelCampaign = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to cancel this campaign?",
      onOk: async () => {
        return await instance.SMS_Campaign_SetAsDraft(id).then(async (data) => {
          if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
            await getCampaignList();
          }
        });
      },
    });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const searchArray = value ? campaignInfo : campaignListToSearch;
    const data = Utils.wildCardSearch(searchArray, value);
    setCampaignInfo(data);
  };

  useEffect(() => {
    (async function IIFE() {
      await getCampaignList();
    })();
    return () => instance._source.cancel();
  }, []);
  return (
    <>
      <Flex
        justifyContent="between"
        alignItems="center"
        className="py-4"
        mobileFlex={false}
      >
        <div className="mb-3 mb-md-0">
          <Input
            placeholder={TranslateText("search")}
            prefix={<SearchOutlined />}
            onChange={(e) => onSearch(e)}
          />
        </div>
        <Link to={`${match.url}/add`}>
          <Button type="primary">
            <PlusOutlined /> <span>{TranslateText("new.campaign")}</span>
          </Button>
        </Link>
      </Flex>
      <Table
        loading={tableLoading}
        columns={CampaignColumns(match, deleteCampaign, cancelCampaign)}
        dataSource={campaignInfo}
        rowKey={"ID"}
      />
    </>
  );
};
export default CampaignList;
