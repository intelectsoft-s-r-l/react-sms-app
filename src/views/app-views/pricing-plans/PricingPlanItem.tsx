import * as React from "react";
import { Card, Popover, Tag, Tooltip } from "antd";
import { IAppPackages } from "api/client/types";
import Flex from "components/shared-components/Flex";

type PricingPlanItemType = {
  pricingPlan: IAppPackages;
};
function PricingPlanItem({ pricingPlan }: PricingPlanItemType) {
  return (
    <Card>
      <Flex justifyContent="between">
        <h4>{pricingPlan.Name}</h4>
        <Popover
          content={
            <div>
              From <b>{pricingPlan.MinValue}</b> transactions to{" "}
              <b>{pricingPlan.MaxValue}</b> transactions
            </div>
          }
        >
          <Tag className="cursor-pointer">
            <h5 style={{ marginTop: "2px" }}>{pricingPlan.Price} MDL</h5>
          </Tag>
        </Popover>
      </Flex>
    </Card>
  );
}
export default PricingPlanItem;
