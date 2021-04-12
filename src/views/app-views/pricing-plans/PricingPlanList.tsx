import * as React from "react";
import { Col, Empty } from "antd";
import PricingPlanItem from "./PricingPlanItem";
import { IAppPackages } from "api/client/types";

function PricingPlanList({ pricingPlans }: { pricingPlans: IAppPackages[] }) {
  if (pricingPlans.length === 0) {
    return <Empty />;
  }
  return (
    <>
      {pricingPlans
        .sort((a, b) => a.SortIndex - b.SortIndex)
        .map((pricingPlan) => {
          return (
            <Col
              xs={24}
              sm={24}
              lg={8}
              xl={8}
              xxl={6}
              key={pricingPlan["ID"]}
              className="m-3"
            >
              <PricingPlanItem pricingPlan={pricingPlan} />
            </Col>
          );
        })}
    </>
  );
}
export default PricingPlanList;
