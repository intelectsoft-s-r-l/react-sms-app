import * as React from "react";
import { Card, Menu } from "antd";
import { Link } from "react-router-dom";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { MailService } from "api/mail";
import { EnErrorCode } from "api";

interface IBookListItem {
  Name: string;
  id: number;
  CreateDate: any;
  Contacts: any[];
}
const handleDropdown = (element: any, getAddressBooks: () => void) => (
  <Menu>
    <Menu.Item
      onClick={async () => {
        return await new MailService()
          .DeleteContactList(element.ID)
          .then((data) => {
            console.log(element.ID);
            if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
              getAddressBooks();
            }
          });
      }}
    >
      Delete
    </Menu.Item>
  </Menu>
);
function BookListItem(props: any) {
  const { Name, match, Phone, Email, ID } = props;
  return (
    <Card className="w-100">
      <div className="d-flex justify-content-between w-100">
        <div>
          <p>12/12/2020 16:40</p>
          <h3>
            <Link to={match.url + `/emails?id=${ID}`}>{Name}</Link>
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
        <div>
          <div className="text-right">
            <EllipsisDropdown
              menu={handleDropdown(props, props.getAddressBooks)}
              isHorizontal
            />
          </div>
          <div
            className="d-flex justify-content-between align-items-center text-center"
            style={{ width: "250px", maxWidth: "100%" }}
          >
            <div>
              <Link to={match.url + `/emails?id=${ID}`}>
                <span style={{ display: "block" }}>
                  <span style={{ fontSize: 30 }}>{Email}</span>
                  <br />
                  <small>Emails</small>
                </span>
              </Link>
            </div>
            <div>
              <Link to={match.url + `/phones?id=${ID}`}>
                <span style={{ display: "block" }}>
                  <span style={{ fontSize: 30 }}>{Phone}</span>
                  <br />
                  <small>Phones</small>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
export default BookListItem;
