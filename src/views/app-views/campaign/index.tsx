import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import Utils from "utils";
import AddCampaignSuccess from "./AddCampaignSuccess";
import CampaignList from "./CampaignList";
import CampaignPage from "./CampaignPage";

export enum send {
  NOW = 2,
  DELAY = 1,
  DRAFT = 0,
}
export const MAX_SMS = 160;
export interface IPhoneNumbers {
  name: string;
  value: string;
}
export function getScheduledDate(val: number, date: any) {
  if (val === send.DELAY) {
    return Utils.handleDotNetDate(date);
  }
  return Utils.handleDotNetDate(Date.now());
}
export interface IPhoneNumbers {
  name: string;
  value: string;
}
export const rules = {
  Name: [
    {
      required: true,
      message: "Please input a campaign name!",
    },
  ],
  Description: [
    {
      required: true,
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
      required: true,
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
const SmsCampaign = (props: RouteComponentProps) => {
  return (
    <Switch>
      <Route exact path={props.match.url}>
        <CampaignList {...props} />
      </Route>
      <Route exact path={`${props.match.url}/edit`}>
        <CampaignPage {...props} />
      </Route>
      <Route exact path={`${props.match.url}/add`}>
        <CampaignPage {...props} />
      </Route>
      <Route exact path={`${props.match.url}/success`}>
        <AddCampaignSuccess {...props} />
      </Route>
    </Switch>
  );
};
export default SmsCampaign;
