import * as React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "utils/hooks/useQuery";
import { Result, PageHeader, Tabs, Card } from "antd";
import { Link, Route, RouteComponentProps } from "react-router-dom";
import InsertManually from "./InsertManually";
import UploadFile from "./UploadFile";
import ImportFrom from "./ImportFrom";
import { ContactList, ContactListResponse } from "api/mail/types";
import Loading from "components/shared-components/Loading";
import { MailService } from "api/mail";
import { EnErrorCode } from "api";
import { UploadContext } from "./uploadContext";
import { uploadReducer, uploadState } from "./uploadReducer";
import ContactResult from "./ContactResult";
import ContactTable from "./ContactTable";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [state, dispatch] = React.useReducer(uploadReducer, uploadState);
  const getContactList = async () => {
    return await new MailService()
      .GetContactList(+query.get("id")!)
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          dispatch({ type: "SET_ADDRESSBOOK", payload: data.ContactsList });
          setAddressBook(data.ContactsList);
        }
      });
  };
  useEffect(() => {
    (async function dumb() {
      await getContactList();
    })();
  }, [query.get("id")]);
  if (loading) {
    return <Loading />;
  }
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
    <UploadContext.Provider value={{ state, dispatch }}>
      <PageHeader
        title={
          <div style={{ fontWeight: 400 }}>
            <span style={{ fontSize: 30 }}>Add contacts:</span>{" "}
            <Link
              to={props.match.url + `/item?id=${addressBook.ID}`}
              style={{ fontSize: 30 }}
            >
              {addressBook.Name}
            </Link>{" "}
            ({addressBook.Phone} contacts)
          </div>
        }
      >
        {state.hasUploaded && !state.hasVariables ? (
          <ContactResult />
        ) : state.hasUploaded && state.hasVariables ? (
          <ContactTable />
        ) : (
          <Tabs defaultActiveKey="2" type="line">
            {uploadTabs(props).map(({ key, title, component: Component }) => (
              <Tabs.TabPane tab={title} key={key}>
                {Component}
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </PageHeader>
    </UploadContext.Provider>
  );
};
export default Upload;
