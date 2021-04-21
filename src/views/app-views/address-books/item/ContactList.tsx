import * as React from "react";
import { useState, useEffect } from "react";
import { Card, Table } from "antd";
import Utils from "utils";
import { EnSelect } from "../upload/ContactTable";
import "./contact_list.scss";
import { table } from "node:console";
import { RouteComponentProps } from "react-router";

const ContactListStyle = {
  table: {
    borderCollapse: "separate",
    display: "inline-block",
  },
  thead: {
    display: "inline-block",
  },
  tbody: {
    display: "inline-block",
  },
} as const;
type ContactListType = RouteComponentProps & {
  book: any;
};
const ContactList = (props: ContactListType) => {
  const { book } = props;
  const contacts = Utils.decodeBase64(book.ContactsData).contacts ?? [];
  const variables =
    Utils.decodeBase64(book.ContactsData).variables.filter(
      (variable: any) =>
        variable.value !== EnSelect.DISABLED &&
        variable.value !== EnSelect.CREATE
    ) ?? [];
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
    } else if (props.location.pathname.includes("phones")) {
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
export default ContactList;
