import * as React from "react";
import { useState, useEffect } from "react";
import { Card, message, Table } from "antd";
import Utils from "utils";
import { EnSelect } from "../upload/UploadTable";
import "./contact_table.scss";
import { RouteComponentProps } from "react-router";
import ContactActions from "./ContactActions";
import { MailService } from "api/mail";
import { EnErrorCode } from "api";
import { ContactList } from "api/mail/types";

type ContactTableProps = RouteComponentProps & {
  book: ContactList;
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

  const deleteRowItem = async (id: string) => {
    const contactsData = {
      contacts: Utils.decodeBase64(book.ContactsData).contacts.filter(
        (elem: any) => elem.id !== id
      ),
      variables: Utils.decodeBase64(book.ContactsData).variables,
    };
    return await new MailService()
      .UpdateContactList({
        ...book,
        ContactsData: Utils.encodeBase64(contactsData),
        Phone: book.Phone! - 1,
      })
      .then((data) => {
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          message.success("Contact deleted!");
          setContactsData({
            contacts: contactsData.contacts,
          });
        }
      });
  };

  return (
    <Card>
      <Table
        dataSource={contactsData.contacts}
        columns={[
          ...columns,
          {
            dataIndex: "actions",
            render: (_: any, elem: any) => (
              <ContactActions {...elem} deleteRowItem={deleteRowItem} />
            ),
          },
        ]}
        rowKey={"id"}
      />
    </Card>
  );
};
export default ContactTable;
