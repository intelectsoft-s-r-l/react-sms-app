import * as React from "react";
import { Table } from "antd";

const ContactList = () => {
  const tableColumns = [
    {
      title: "Phone",
      dataIndex: "Phone",
    },
    {
      title: "Email",
      dataIndex: "Email",
    },
    {
      title: "Name",
      dataIndex: "Name",
    },
  ];
  return <Table columns={tableColumns} />;
};
export default ContactList;
