import * as React from "react";
import { Card, Menu } from "antd";
import { Link, RouteComponentProps } from "react-router-dom";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { deleteAddressBook } from ".";

interface AddressBooksItemProps {
  Name: string;
  id: number;
  CreateDate: any;
  Contacts: any[];
}
const handleDropdown = (element: any) => (
  <Menu>
    <Menu.Item onClick={() => {}}>Delete</Menu.Item>
  </Menu>
);
const AddressBooksItem = (props: any) => {
  const { Name, match, Phone, Email, ID } = props;
  return (
    <Card className="w-100">
      <div className="d-flex justify-content-between w-100">
        <div>
          <p>12/12/2020 16:40</p>
          <h3>
            <Link to={match.url + `/item?id=${ID}`}>{Name}</Link>
          </h3>
          <div>
            {Phone > 0 ? (
              `Contacts: ${Phone}`
            ) : (
              <div>
                No contacts,{" "}
                <Link to={match.url + `/upload?id=${ID}`}>add</Link>
              </div>
            )}
          </div>
        </div>
        <div className="text-center">
          <EllipsisDropdown menu={handleDropdown(props)} isHorizontal />
          <Link to={match.url + `/item?id=${ID}`}>
            <div>
              <a style={{ fontSize: 30 }}>{Phone}</a>
              <br />
              <small>Phones</small>
            </div>
          </Link>
        </div>
      </div>
    </Card>
  );
};
export default AddressBooksItem;
