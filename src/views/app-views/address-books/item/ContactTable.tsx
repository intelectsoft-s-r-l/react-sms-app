import * as React from "react";
import { useState, useEffect } from "react";
import { Card, Table } from "antd";
import Utils from "utils";
import { EnSelect } from "../upload/UploadTable";
import "./contact_table.scss";
import { RouteComponentProps } from "react-router";

type ContactTableProps = RouteComponentProps & {
  book: any;
};
const ContactTable = (props: ContactTableProps) => {
  const { book } = props;
  const contacts = Utils.decodeBase64(book.ContactsData).contacts ?? [];
  const variables =
    (Utils.decodeBase64(book.ContactsData).variables &&
      Utils.decodeBase64(book.ContactsData).variables.filter(
        (variable: any) =>
          variable.value !== EnSelect.DISABLED &&
          variable.value !== EnSelect.CREATE
      )) ??
    [];
  const [contactsData, setContactsData] = useState<any>({
    contacts: [],
    variables: [],
  });
  const [columns, setColumns] = useState<any[]>([]);
  useEffect(() => {
    // TODO: If it's email route don't show rows without email,
    // do the same for phones
    if (props.location.pathname.includes("emails")) {
      let emailContacts = contacts
        .map((elem: any) => {
          return Object.keys(elem)
            .filter((key: any) => {
              return elem.hasOwnProperty("Email");
            })
            .reduce((acc: any, key: any) => {
              acc[key] = elem[key];
              return acc;
            }, {});
        })
        .filter((elem: any) => Object.keys(elem).length !== 0);

      let emailVariables = Utils.moveElement(
        variables,
        EnSelect.EMAIL,
        EnSelect.PHONE
      );
      setContactsData({
        contacts: emailContacts,
        variables: emailVariables,
      });
      setColumns(
        emailVariables.reduce((acc: any, variable: any) => {
          const { title } = variable;
          return [...acc, { title, dataIndex: title }];
        }, [])
      );
    } else {
      let phoneContacts = contacts
        .map((elem: any) => {
          return Object.keys(elem)
            .filter((key: any) => {
              return elem.hasOwnProperty("Phone");
            })
            .reduce((acc: any, key: any) => {
              acc[key] = elem[key];
              return acc;
            }, {});
        })
        .filter((elem: any) => Object.keys(elem).length !== 0);
      setContactsData({
        contacts: phoneContacts,
        variables,
      });
      console.log(phoneContacts);
      setColumns(
        variables.reduce((acc: any, variable: any) => {
          const { title } = variable;
          return [...acc, { title, dataIndex: title }];
        }, [])
      );
    }
  }, [props.location.pathname]);

  return (
    <Card>
      <Table
        dataSource={contactsData.contacts}
        columns={columns}
        rowKey={"id"}
      />
    </Card>
  );
};
export default ContactTable;
