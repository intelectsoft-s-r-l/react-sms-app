import * as React from "react";
import { Card, Tag, Tooltip } from "antd";
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
        <Tooltip
          title={`From ${pricingPlan.MinValue} to ${pricingPlan.MaxValue}`}
        >
          <Tag className="cursor-pointer">
            <h5>{pricingPlan.Price} MDL</h5>
          </Tag>
        </Tooltip>
      </Flex>
    </Card>
  );
}
export default PricingPlanItem;
