import * as React from "react";
import { useState, useEffect } from "react";
import { Card, message, Table } from "antd";
import Utils from "utils";
import { EnSelect } from "../../upload/UploadTable";
import { RouteComponentProps } from "react-router";
import ContactActions from "./ContactActions";
import { MailService } from "api/mail";
import { EnErrorCode } from "api";
import { ContactList } from "api/mail/types";
import { FormInstance } from "antd/es/form/Form";
import EditableRow from "./EditableRow";
import EditableCell from "./EditableCell";
import { ColumnsType } from "antd/lib/table";
import "./contact-table.scss";

type ContactTableProps = RouteComponentProps & {
  book: ContactList;
};
type VariableType = {
  value: number;
  title: string;
  isDefault: boolean;
};
type ContactType = {
  [prop in VariableType["title"]]: string;
};
type ContactsDataType = {
  contacts: ContactType[];
  variables: VariableType[];
};
export const EditableContext = React.createContext<FormInstance<any> | null>(
  null
);
const ContactTable = (props: ContactTableProps) => {
  const { book } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const contacts = Utils.decodeBase64(book.ContactsData).contacts ?? [];
  const variables: VariableType[] =
    (Utils.decodeBase64(book.ContactsData).variables &&
      Utils.decodeBase64(book.ContactsData).variables.filter(
        (variable: any) =>
          variable.value !== EnSelect.DISABLED &&
          variable.value !== EnSelect.CREATE
      )) ??
    [];
  const [contactsData, setContactsData] = useState<ContactsDataType>({
    contacts: [],
    variables: [],
  });
  const [columns, setColumns] = useState<ColumnsType[]>([]);

  useEffect(() => {
    // TODO: If it's email route don't show rows without email,
    // do the same for phones
    if (props.location.pathname.includes("emails")) {
      let emailContacts = contacts
        .map((elem: ContactType) => {
          return Object.keys(elem)
            .filter(() => {
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
          const { title, isDefault } = variable;
          return [
            ...acc,
            {
              title,
              dataIndex: title,
              editable: title !== "Email" ? true : false,
            },
          ];
        }, [])
      );
    } else {
      let phoneContacts = contacts
        .map((elem: ContactType) => {
          return Object.keys(elem)
            .filter((key) => {
              return elem.hasOwnProperty("Phone");
            })
            .reduce((acc: any, key: any) => {
              acc[key] = elem[key];
              return acc;
            }, {});
        })
        .filter((elem: ContactType) => Object.keys(elem).length !== 0);
      setContactsData({
        contacts: phoneContacts,
        variables,
      });
      setColumns(
        variables.reduce((acc: any, variable: any) => {
          const { title } = variable;
          return [
            ...acc,
            {
              title,
              dataIndex: title,
              editable: title !== "Email" ? true : false,
            },
          ];
        }, [])
      );
    }
  }, [props.location.pathname]);

  const deleteRowItem = async (id: string) => {
    const newData = Utils.decodeBase64(book.ContactsData).contacts.filter(
      (elem: any) => elem.id !== id
    );
    const contactsData = {
      contacts: newData,
      variables: Utils.decodeBase64(book.ContactsData).variables,
    };
    return await new MailService()
      .UpdateContactList({
        ...book,
        ContactsData: Utils.encodeBase64(contactsData),
        Phone: newData.map((elm: any) => elm.Phone).filter((elm: any) => elm)
          .length,
        Email: newData.map((elm: any) => elm.Email).filter((elm: any) => elm)
          .length,
      })
      .then((data) => {
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          message.success("Contact deleted!");
          setContactsData({
            contacts: contactsData.contacts,
            variables: contactsData.variables,
          });
        }
      });
  };
  const handleSave = async (row: ContactType) => {
    const newData = [...contactsData.contacts];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    // Validate email and phones
    let canBeSubmitted = true;
    for (let key in row) {
      if (row[key] === null || row[key] === undefined || row[key] === "") {
        delete row[key];
      }
      if (key === "Phone" && !Utils.isNumeric(row[key]) && row[key]) {
        canBeSubmitted = false;
        message.error("Phone should contain only numbers!");
      }
    }
    if (canBeSubmitted && JSON.stringify(item) !== JSON.stringify(row)) {
      const dataToSend = newData.map((elm) =>
        Object.keys(elm)
          .filter((key) => elm[key].length)
          .reduce((acc: any, key: any) => {
            acc[key] = elm[key];
            return acc;
          }, {})
      );
      const ContactsData = {
        contacts: dataToSend,
        variables: Utils.decodeBase64(book.ContactsData).variables,
      };
      setLoading(true);
      return await new MailService()
        .UpdateContactList({
          ...book,
          ContactsData: Utils.encodeBase64(ContactsData),
          Phone: dataToSend.map((elm) => elm.Phone).filter((elm) => elm).length,
          Email: dataToSend.map((elm) => elm.Email).filter((elm) => elm).length,
        })
        .then((data) => {
          setLoading(false);
          if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
            setContactsData({
              contacts: newData,
              variables: Utils.decodeBase64(book.ContactsData).variables,
            });
          }
        });
    }
  };
  const cols = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ContactType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  return (
    <Card>
      <Table
        loading={loading}
        components={components}
        rowClassName={() => "editable-row"}
        dataSource={contactsData.contacts}
        columns={[
          ...cols,
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
