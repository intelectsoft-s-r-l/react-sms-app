import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, message } from "antd";
import { ContactsToSubmit } from "./UploadTable";
import { MailService } from "api/mail";
import { UploadContext } from "./uploadContext";
import { EnErrorCode } from "api";
import Utils from "utils";

const getResults = (lines: number, phones: number, emails: number) => [
  {
    title: "Lines read",
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
function getAmount(array: ContactsToSubmit[], occurence: "Phone" | "Email") {
  const count = array
    .map((obj) => {
      return Object.keys(obj).filter((key) => key === occurence);
    })
    .filter((elm) => elm.length).length;
  return count;
}
function UploadResult(props: any) {
  const [loading, setLoading] = useState<boolean>(true);
  const { state, dispatch } = React.useContext(UploadContext);
  const [contacts, setContacts] = useState<any>([]);
  const updateAddressBook = async (dataToSend: any) => {
    const variables =
      Utils.decodeBase64(state.addressBook.ContactsData).variables ?? [];
    const apiContacts =
      Utils.decodeBase64(state.addressBook.ContactsData).contacts ?? [];

    const ContactsData = {
      variables,
      contacts: [...apiContacts, ...dataToSend],
    };

    return await new MailService()
      .UpdateContactList({
        ...state.addressBook,
        ContactsData: Utils.encodeBase64(ContactsData),
        Phone: state.addressBook.Phone + getAmount(dataToSend, "Phone"),
        Email: state.addressBook.Email + getAmount(dataToSend, "Email"),
      })
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          message.success("Address book successfully updated!");
        }
      });
  };
  useEffect(() => {
    // TODO: Verify contacts for duplicates

    const data = state.uploadedContacts
      .map((elem: any) => {
        return Object.keys(elem)
          .filter((key) => {
            if (key === "Email") {
              return Utils.isEmail(elem[key].trim());
            }
            if (key === "Phone") {
              return Utils.isNumeric(elem[key].trim());
            }
            return elem[key].trim();
          })
          .reduce((acc: any, key: any) => {
            acc[key] = elem[key];
            return acc;
          }, {});
      })
      .filter((elem: any) => {
        // Get rid of objects that don't have at least one Phone or Email
        return elem.hasOwnProperty("Phone") || elem.hasOwnProperty("Email");
      });
    setContacts(data);
    updateAddressBook(data);
  }, []);
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
            {getResults(
              contacts.length,
              getAmount(contacts, "Phone"),
              getAmount(contacts, "Email")
            ).map((res) => (
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
      <Link
        to={`${props.match.url}/${
          getAmount(contacts, "Phone") > getAmount(contacts, "Email")
            ? "phones"
            : "emails"
        }?id=${state.addressBook.ID}`}
      >
        <Button type="primary">View contacts</Button>
      </Link>
    </>
  );
}

export default UploadResult;
