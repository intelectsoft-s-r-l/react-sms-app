import * as React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "utils/hooks/useQuery";
import { Result, PageHeader, Tabs, Card } from "antd";
import { Link, Route, RouteComponentProps } from "react-router-dom";
import InsertManually from "./InsertManually";
import UploadFile from "./UploadFile";
import ImportFrom from "./ImportFrom";

/*
 * This component will need 3 separate tabs
 * 1. Upload file
 * 2. Copy & Paste
 * 3. Import from service
 */

// Upload contacts component

const uploadTabs = (props: RouteComponentProps) => [
  {
    key: "1",
    title: "Insert manually",
    component: <InsertManually {...props} />,
  },
  {
    key: "2",
    title: "Upload file",
    component: <UploadFile />,
  },
  {
    key: "3",
    title: "Import",
    component: <ImportFrom />,
  },
];
const Upload = (props: RouteComponentProps) => {
  const query = useQuery();
  const [addressBook, setAddressBook] = useState<any | undefined>(undefined);
  useEffect(() => {
    setAddressBook(
      JSON.parse(localStorage.getItem("address-books") ?? "[]").find(
        (elem: any) => elem.id == query.get("id")
      )
    );
  }, [query.get("id")]);
  if (!addressBook) {
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
        title={
          <div style={{ fontWeight: 400 }}>
            <span style={{ fontSize: 30 }}>Add contacts:</span>{" "}
            <Link
              to={props.match.url + `/item?id=${addressBook.id}`}
              style={{ fontSize: 30 }}
            >
              {addressBook.Name}
            </Link>{" "}
            ({addressBook.Contacts.length} contacts)
          </div>
        }
        onBack={() => props.history.push(props.match.url)}
      />

      <Tabs defaultActiveKey="1">
        {uploadTabs(props).map(({ key, title, component: Component }) => (
          <Tabs.TabPane tab={title} key={key}>
            <Card style={{ maxWidth: "600px" }}>{Component}</Card>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </>
  );
};
export default Upload;
