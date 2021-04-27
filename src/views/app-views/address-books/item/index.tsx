import * as React from "react";
import { Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { PageHeader, Result } from "antd";
import { RouteComponentProps } from "react-router";
import { useQuery } from "utils/hooks/useQuery";
import { Link } from "react-router-dom";
import ContactTable from "./contact-table";
import Loading from "components/shared-components/Loading";
import { MailService } from "api/mail";
import { EnErrorCode } from "api";

const BookItem = (props: RouteComponentProps) => {
  const query = useQuery();
  const [book, setBook] = useState<any | undefined>(undefined);
  const [variables, setVariables] = useState<any>([]);
  const [contacts, setContacts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getContactList = async () => {
    return await new MailService()
      .GetContactList(+query.get("id")!)
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          setBook(data.ContactsList);
        }
      });
  };
  useEffect(() => {
    getContactList();
  }, [query.get("id")]);

  if (loading) {
    return <Loading />;
  }

  if (!book) {
    return (
      <Result
        title="Address book not found"
        status="404"
        extra={<Link to={props.match.url}>Find your way</Link>}
      />
    );
  }
  return (
    <>
      <PageHeader
        style={{ padding: 0 }}
        title={<h1>{book.Name}</h1>}
        onBack={() => props.history.push(props.match.url)}
      />
      <div className="mb-4 mt-2">
        <Link to={`${props.match.url}/upload?id=${query.get("id")}`}>
          <Button type="primary">
            <UserAddOutlined /> Add contacts
          </Button>
        </Link>
      </div>
      <ContactTable book={book} {...props} />
    </>
  );
};
export default BookItem;
