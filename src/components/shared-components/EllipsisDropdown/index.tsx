import * as React from "react";
import { Dropdown, Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
export interface IEllipsisDropdown {
  menu: any;
  placement?: any;
  isHorizontal?: boolean;
}
const EllipsisDropdown = ({
  menu = <Menu />,
  isHorizontal = false,
  placement = "bottomRight",
}: IEllipsisDropdown) => {
  return (
    <Dropdown overlay={menu} placement={placement} trigger={["click"]}>
      <div>
        <EllipsisOutlined
          className="ellipsis-dropdown"
          style={{ transform: isHorizontal ? "rotate(0deg)" : "" }}
        />
      </div>
    </Dropdown>
  );
};

export default EllipsisDropdown;
