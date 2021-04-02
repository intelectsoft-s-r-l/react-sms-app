import * as React from "react";
import { Col, Empty } from "antd";
import { useSelector } from "react-redux";
import { IState } from "redux/reducers";
import PricingPlanItem from "./PricingPlanItem";

function PricingPlanList() {
  const pricingPlans = useSelector((state: IState) => state.app.Packages);
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
