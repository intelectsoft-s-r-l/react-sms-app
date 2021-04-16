import * as React from "react";
import { useState, useEffect } from "react";
import { Table } from "antd";
import Utils from "utils";
import { EnSelect } from "../upload/ContactTable";
import "./contact_list.scss";

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
const ContactList = (props: any) => {
  let vertical = true;
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
    console.log(data);
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
    return data;
  };
  const vars = contactsData.variables.filter(
    (header: any) =>
      header.value !== EnSelect.DISABLED && header.value !== EnSelect.CREATE
  );
  const renderHeader = () => {
    return contactsData.variables
      .filter(
        (header: any) =>
          header.value !== EnSelect.DISABLED && header.value !== EnSelect.CREATE
      )
      .map((header: any) => (
        <th key={header.value} id={header.value}>
          {header.title}
        </th>
      ));
  };

  const tableFormationHandle = () => {};

  const updateValueColumn = (value: any) => {};

  if (vertical) {
    return (
      <div
        style={{
          display: "table",
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <div style={{ display: "table-row" }}>
          {vars.map((header: any) => (
            <div
              style={{
                display: "table-cell",
                padding: "5px",
              }}
            >
              {header.title}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "table-row",
            background: "white",
            borderRadius: 3,
          }}
        >
          {vars.map((header: any, index: any) => {
            return (
              <div
                id={header.value}
                style={{
                  display: "table-cell",
                  border: "1px solid #dadada",
                  padding: "5px",
                }}
              >
                {groupedItems()
                  .filter((item, index) => item.variableId === header.value)
                  .map((item, index) => {
                    return item.contacts.map((con: any, index: any) => {
                      return <div style={{ color: "black" }}>{con}</div>;
                    });
                  })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <table style={ContactListStyle.table} id="contact-table">
      <thead style={ContactListStyle.thead}>
        {vars.map((header: any) => (
          <tr>
            <th>{header.title}</th>
          </tr>
        ))}
      </thead>
      <tbody style={ContactListStyle.tbody}>
        {vars.map((header: any) => (
          <tr id={header.value}>
            {groupedItems().map((item: any) => {
              if (item.variableId !== header.value) {
                return <td>&nbsp;</td>;
              }
            })}
            {groupedItems()
              .filter((item, index) => item.variableId === header.value)
              .map((item, index) => {
                if (item === undefined || item === null) {
                  return <td>&nbsp;</td>;
                }
                return item.contacts.map((con: any, idx: number) => {
                  return <td key={idx}>{con}</td>;
                });
              })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default ContactList;
