import * as React from "react";
import { Dropdown, Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
export interface IEllipsisDropdown {
  menu: any;
  placement?: any;
}
const EllipsisDropdown = ({
  menu = <Menu />,
  placement = "bottomRight",
}: IEllipsisDropdown) => {
  return (
    <Dropdown overlay={menu} placement={placement} trigger={["click"]}>
      <div className="ellipsis-dropdown">
        <EllipsisOutlined />
      </div>
    </Dropdown>
  );
};

export default EllipsisDropdown;
