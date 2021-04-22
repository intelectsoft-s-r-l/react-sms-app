import * as React from "react";
import { useEffect, useState } from "react";
import { Button, message } from "antd";
import Utils from "utils";
import "./table.scss";
import { UploadContext } from "./uploadContext";
import CreateVariableModal from "./CreateVariableModal";
import { MailService } from "api/mail";
import { useQuery } from "utils/hooks/useQuery";
import { ContactList } from "api/mail/types";
import { EnErrorCode } from "api";
// @ts-ignore
import shortid from "shortid";

export enum EnSelect {
  DISABLED = 0,
  CREATE = 1,
  PHONE = 2,
  EMAIL = 3,
  NAME = 4,
  GENDER = 5,
  AGE = 6,
}
export type ContactsToSubmit = {
  [key: string]: string;
};

export const predefinedHeaders = [
  {
    value: EnSelect.DISABLED,
    title: "Disabled",
    isDefault: true,
  },
  {
    value: EnSelect.CREATE,
    title: "Create variable",
    isDefault: true,
  },
  {
    value: EnSelect.PHONE,
    title: "Phone",
    isDefault: true,
  },
  {
    value: EnSelect.EMAIL,
    title: "Email",
    isDefault: true,
  },
];
function UploadTable() {
  const { state, dispatch } = React.useContext(UploadContext);
  const selectRefs = React.useRef<any[]>([]);
  const uploadedContacts = state.uploadedContacts.filter(
    (value: string[]) => JSON.stringify(value) !== '[""]'
  );
  useEffect(() => {
    // Reference to the select boxes
    // You can manipulate with them later on
    selectRefs.current = state.headers.map(
      (_: any, i: number) => selectRefs.current[i] ?? React.createRef()
    );
  }, []);

  const addContacts = async () => {
    let isThereEmailOrPhone = Object.keys(state.selected).some((sel: any) => {
      return (
        state.selected[sel]["variableId"] === EnSelect.PHONE ||
        state.selected[sel]["variableId"] === EnSelect.EMAIL
      );
    });
    if (isThereEmailOrPhone) {
      let finalData: ContactsToSubmit[] = [];
      uploadedContacts.forEach((contacts: string[]) => {
        let tempHeaders: any = {};
        contacts.forEach((contact: string, idx: number) => {
          state.headers[0].forEach((header: any) => {
            if (
              header.value !== EnSelect.CREATE &&
              header.value !== EnSelect.DISABLED &&
              header.value === state.selected[idx].variableId
            ) {
              tempHeaders[header.title] = contact;
              tempHeaders.id = shortid.generate();
            }
          });
        });
        finalData.push({ ...tempHeaders });
      });
      dispatch({
        type: "SUBMIT_CONTACTS",
        payload: finalData,
      });
    } else {
      // User has to select at least one email or phone
      message.error({
        content: "Select at least one email or phone!",
        duration: 1,
        key: "updatable",
      });
    }
  };

  const createVariable = async (varName: string) => {
    const headerId = state.headers[0].length;
    // On the clicked dropdown make the default selected variable the one that was created
    const currentTarget = selectRefs.current.find(
      (el) => +el.current.dataset.id === +state.selectId
    );
    currentTarget.current.focus();
    currentTarget.current.value = headerId;
    dispatch({
      type: "CREATE_VARIABLE",
      target: currentTarget.current!,
      id: headerId,
      variableName: varName,
    });
    const data = {
      variables: [
        ...state.headers[0],
        { value: headerId, title: varName, isDefault: false },
      ],
      contacts:
        Utils.decodeBase64(state.addressBook.ContactsData).contacts ?? [],
    };
    console.log(data);
    // Update state.addressBook
    dispatch({
      type: "SET_ADDRESSBOOK",
      payload: { ...state.addressBook, ContactsData: Utils.encodeBase64(data) },
    });
    return new MailService()
      .UpdateContactList({
        ...state.addressBook,
        ContactsData: Utils.encodeBase64(data),
      })
      .then((data) => {
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          message.success("Variable successfully created!");
        }
      });
  };
  return (
    <div>
      <CreateVariableModal createVariable={createVariable} />
      <div className="preview-table">
        <table className="preview-table__upload">
          <tbody>
            <tr>
              {state.headers.map((item: any, index: any) => (
                <th key={index}>
                  <div>
                    <select
                      className="preview-table__select"
                      data-id={index}
                      ref={selectRefs.current[index]}
                      value={state.selected[index].variableId}
                      onChange={(event) => {
                        const target = event.target;
                        if (+target.value === EnSelect.CREATE) {
                          dispatch({
                            type: "SHOW_CREATE_VISIBLE",
                            selectId: +target.dataset.id!,
                          });
                        }
                        if (target) {
                          dispatch({ type: "ON_SELECT_CHANGE", target });
                        }
                      }}
                    >
                      {item.map((elm: any, idx: any) => (
                        <option value={elm.value} key={idx}>
                          {elm.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </th>
              ))}
            </tr>
            {uploadedContacts.map((item: any, index: any) => {
              return (
                <tr key={index}>
                  {item.map((elm: any, tdIndex: any) => {
                    return <td key={tdIndex}>{elm.trim()}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <Button type="primary" className="mr-3" onClick={() => addContacts()}>
          Add
        </Button>
        <Button onClick={() => window.location.reload()}>Cancel</Button>
      </div>
    </div>
  );
}
export default UploadTable;
