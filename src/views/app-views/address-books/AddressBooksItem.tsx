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
    <Menu.Item
      onClick={() => {
        deleteAddressBook(element.id);
        window.location.reload();
      }}
    >
      Delete
    </Menu.Item>
  </Menu>
);
const AddressBooksItem = ({ book, match }: any) => {
  return (
    <Card className="w-100">
      <div className="d-flex justify-content-between w-100">
        <div>
          <p>{book.CreateDate}</p>
          <h3>
            <Link to={match.url + `/item?id=${book.id}`}>{book.Name}</Link>
          </h3>
          <div>
            {book.Contacts.length > 0 ? (
              `Contacts: ${book.Contacts.length}`
            ) : (
              <div>
                No contacts,{" "}
                <Link to={match.url + `/upload?id=${book.id}`}>add</Link>
              </div>
            )}
          </div>
        </div>
        <div className="text-center">
          <EllipsisDropdown menu={handleDropdown(book)} isHorizontal />
          <Link to={match.url + `/item?id=${book.id}`}>
            <div>
              <a style={{ fontSize: 30 }}>{book.Contacts.length}</a>
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
