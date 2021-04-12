import * as React from "react";
import { useState, useEffect } from "react";
import { EnErrorCode } from "api";
import { PortalService } from "api/client";
import PricingPlanList from "./PricingPlanList";
import { SMS_ID } from "constants/ApiConstant";
import { IAppPackages } from "api/client/types";

function PricingPlan() {
  const [packages, setPackages] = useState<IAppPackages[]>([]);
  const getAppInfo = async () => {
    return await new PortalService().GetAppInfo().then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        const smsApp = data.MarketAppList.find((app) => app.ID === SMS_ID);
        setPackages(smsApp!.Packages!);
      }
    });
  };
  useEffect(() => {
    getAppInfo();
  }, []);

  return (
    <div>
      <PricingPlanList pricingPlans={packages} />
    </div>
  );
}
export default PricingPlan;
