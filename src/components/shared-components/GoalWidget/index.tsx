import * as React from "react";
import { Card, Progress } from "antd";

export const GoalWidget = ({
  title,
  value,
  size = 150,
  subtitle,
  strokeWidth = 4,
  extra,
}: any) => {
  return (
    <Card>
      <div className="text-center">
        {title && <h4 className="mb-3 font-weight-bold">{title}</h4>}
        <Progress
          type="dashboard"
          percent={value}
          width={size}
          strokeWidth={strokeWidth}
        />
        <div
          className={`mt-2 mx-auto text-muted ${extra ? "mb-3" : ""}`}
          style={{ maxWidth: `${size + 30}px` }}
        >
          {subtitle}
        </div>
        {extra}
      </div>
    </Card>
  );
};

export default GoalWidget;
