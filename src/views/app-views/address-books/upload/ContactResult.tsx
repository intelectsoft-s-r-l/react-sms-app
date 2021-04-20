import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, Button } from "antd";
import ContactTable from "./ContactTable";
import Loading from "components/shared-components/Loading";
import { MailService } from "api/mail";
import { UploadContext } from "./uploadContext";
import { EnErrorCode } from "api";

const getResults = (lines: number, phones: number, emails: number) => [
  {
    title: "Lines read from file",
    value: lines,
  },
  {
    title: "Phones added",
    value: phones,
  },
  {
    title: "Emails added",
    value: emails,
  },
];
function ContactResult(props: any) {
  const [loading, setLoading] = useState<boolean>(true);
  const { state, dispatch } = React.useContext(UploadContext);
  const updateAddressBook = async (data: any) => {
    return await new MailService()
      .UpdateContactList({
        ...state.addressBook,
        ContactsData: null, //
      })
      .then((data) => {
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        }
      });
  };
  return (
    <>
      <Alert
        showIcon
        type="success"
        message={
          loading ? (
            "Verification in progress..."
          ) : (
            <div>
              <b>Ready!</b> Addresses successfully added!
            </div>
          )
        }
        className="mb-3"
      />
      <div style={{ marginBottom: "15px" }}>
        <table
          style={{
            borderCollapse: "separate",
            width: "50%",
            maxWidth: "100%",
            borderRadius: "4px",
            borderSpacing: "5px",
          }}
        >
          <tbody>
            {getResults(0, 0, 0).map((res) => (
              <tr
                style={{ backgroundColor: "white", border: "1px solid #ccc" }}
              >
                <td style={{ padding: "5px 0 5px 10px" }}>{res.title}</td>
                <td style={{ textAlign: "center", fontWeight: "bold" }}>
                  {res.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button type="primary">View contacts</Button>
    </>
  );
}

export default ContactResult;
