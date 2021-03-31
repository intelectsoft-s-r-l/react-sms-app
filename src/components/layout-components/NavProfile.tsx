import * as React from "react";
import { Menu, Dropdown, Avatar, Modal } from "antd";
import { connect, useSelector } from "react-redux";
import {
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Icon from "../util-components/Icon";
import { signOut } from "redux/actions/Auth";
import { NavLink } from "react-router-dom";
import IntlMessage from "components/util-components/IntlMessage";
import TranslateText from "utils/translate";
import { IState } from "redux/reducers";
interface INavProfile {
  signOut?: () => void;
}
const menuItem = [
  {
    title: <IntlMessage id={"header.profile.AccountSettings"} />,
    icon: SettingOutlined,
    path: "/app/account-settings",
  },
  {
    title: <IntlMessage id={"header.profile.HelpCenter"} />,
    icon: QuestionCircleOutlined,
    path: "/",
  },
];

const NavProfile = ({ signOut }: INavProfile) => {
  const { confirm } = Modal;
  const FirstName = useSelector((state: IState) => state.account?.FirstName);
  const Photo = useSelector((state: IState) => state.account?.Photo);
  const confirmLogout = () => {
    confirm({
      title: TranslateText("header.logout.message"),
      onOk: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(signOut!());
          }, 1000);
        });
      },
    });
  };

  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar size={45} src={Photo} icon={<UserOutlined />} />
          <div className="pl-3">
            <h4 className="mb-0">{FirstName ?? "User"}</h4>
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu selectable={false}>
          {menuItem.map((el, i) => {
            return (
              <Menu.Item key={i}>
                <NavLink to={el.path}>
                  <Icon className="mr-3" type={el.icon} />
                  <span className="font-weight-normal">{el.title}</span>
                </NavLink>
              </Menu.Item>
            );
          })}
          <Menu.Item key={menuItem.length + 1} onClick={confirmLogout}>
            <span>
              <LogoutOutlined className="mr-3" />
              <span className="font-weight-normal">
                <IntlMessage id={"header.profile.SignOut"} />
              </span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item>
          <Avatar src={Photo} icon={<UserOutlined />} />
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
};

export default connect(null, { signOut })(NavProfile);
