import * as React from "react";
import { Button, Input, Table } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import Flex from "components/shared-components/Flex";
import SmsCampaignColumns from "./SmsCampaignColumns";
import { Link, RouteComponentProps } from "react-router-dom";
import TranslateText from "utils/translate";
import Utils from "utils";
import { SmsService } from "api/sms";
import { ICampaignList } from "api/sms/types";

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
        return Promise;
      }
    });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const searchArray = value ? campaignInfo : campaignListToSearch;
    const data = Utils.wildCardSearch(searchArray, value);
    setCampaignInfo(data);
  };

  useEffect(() => {
    getCampaignList();
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
        columns={SmsCampaignColumns(getCampaignList, match)}
        dataSource={campaignInfo}
        rowKey={"ID"}
      />
    </>
  );
};
export default CampaignList;
