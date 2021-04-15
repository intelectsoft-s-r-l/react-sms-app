import * as React from "react";
import { useState, useEffect } from "react";
import { Table } from "antd";
import Utils from "utils";
import { EnSelect } from "../upload/ContactTable";

const ContactList = (props: any) => {
  const [contactsData, setContactsData] = useState<any>({
    contacts: {},
    variables: [],
  });
  useEffect(() => {
    const data = Utils.decodeBase64(props.book.ContactsData);
    setContactsData(data);
    const info = Object.keys(data.contacts).map((elem: any) => {
      return data.contacts[elem];
    });
    console.log(info);
  }, []);

  const groupBy = (objectArray: any, property: any) => {
    return objectArray.reduce(function (acc: any, obj: any) {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  };

  const groupedItems = () => {
    const data = Object.keys(contactsData.contacts).map((elem: any) => {
      return contactsData.contacts[elem];
    });
    console.log({ data });
    return data;
  };

  return (
    <table>
      <thead>
        <tr>
          {contactsData.variables
            .filter(
              (header: any) =>
                header.value !== EnSelect.DISABLED &&
                header.value !== EnSelect.CREATE
            )
            .map((header: any, index: any) => (
              <th key={header.value} id={header.value}>
                {header.title}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {groupedItems().map((elem) => {
          return (
            <tr>
              {elem.contacts.map((con: any) => (
                <td>{con}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default ContactList;
