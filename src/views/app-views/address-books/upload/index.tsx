import * as React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "utils/hooks/useQuery";
import { Result, PageHeader, Tabs } from "antd";
import { Link, RouteComponentProps } from "react-router-dom";
import InsertManually from "./manual";
import UploadFile from "./file";
import Loading from "components/shared-components/Loading";
import { MailService } from "api/mail";
import { EnErrorCode } from "api";
import { UploadContext } from "./uploadContext";
import { uploadReducer, uploadState } from "./uploadReducer";
import UploadResult from "./UploadResult";
import UploadTable, { predefinedHeaders } from "./UploadTable";
import Utils from "utils";

export interface IUploadProps extends RouteComponentProps {
  uploadContacts: (data: any[]) => void;
}
const uploadTabs = (props: IUploadProps) => [
  {
    key: "1",
    title: "Insert manually",
    component: <InsertManually {...props} />,
  },
  {
    key: "2",
    title: "Upload file",
    component: <UploadFile {...props} />,
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

  const uploadContacts = (data: any[]) => {
    let hasVariables = false;
    data.forEach((contacts) => {
      contacts.forEach((_: any, __: any, array: any) => {
        if (array.length > 1) {
          hasVariables = true;
        }
      });
    });
    hasVariables
      ? dispatch({
          type: "UPLOAD_CONTACTS_WITH_VAR",
          payload: data,
          headers:
            Utils.decodeBase64(state.addressBook.ContactsData).variables ??
            predefinedHeaders,
        })
      : dispatch({
          type: "UPLOAD_CONTACTS",
          payload: data,
        });
  };
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
              to={props.match.url + `/emails?id=${addressBook.ID}`}
              style={{ fontSize: 30 }}
            >
              {addressBook.Name}
            </Link>{" "}
            ({addressBook.Phone} contacts)
          </div>
        }
        onBack={() => props.history.goBack()}
      >
        {state.hasUploaded && !state.hasVariables ? (
          <UploadResult {...props} />
        ) : state.hasUploaded && state.hasVariables ? (
          <UploadTable />
        ) : (
          <Tabs defaultActiveKey="2" type="line">
            {uploadTabs({ ...props, uploadContacts }).map(
              ({ key, title, component: Component }) => (
                <Tabs.TabPane tab={title} key={key}>
                  {Component}
                </Tabs.TabPane>
              )
            )}
          </Tabs>
        )}
      </PageHeader>
    </UploadContext.Provider>
  );
};
export default Upload;
