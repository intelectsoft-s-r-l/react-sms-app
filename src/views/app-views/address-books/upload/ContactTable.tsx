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

export enum EnSelect {
  DISABLED = 0,
  CREATE = 1,
  PHONE = 2,
  EMAIL = 3,
  NAME = 4,
  GENDER = 5,
  AGE = 6,
}
export const selectBoxArray = [
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
// REFACTOR THIS
// Insert in contacts all Titles of SELECTBOXARRAY
function ContactTable() {
  const { state, dispatch } = React.useContext(UploadContext);
  const query = useQuery();
  const [headers, setHeaders] = useState<any[]>([]);
  const [largestOrigin, setLargestOrigin] = useState<number[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const selectRefs = React.useRef<any[]>([]);
  const trRefs = React.useRef<any[]>([]);
  //
  // Make API call and get all the variables and contacts
  // Dispatch them into the UploadContext state
  //
  useEffect(() => {
    //dispatch({ type: "GET_VARIABLES_AND_CONTACTS" });
    const lOrigin = Utils.getLargestArray(state.uploadedContacts);
    setLargestOrigin(lOrigin);
    const headersToFill = new Array(lOrigin.length).fill(
      Utils.decodeBase64(state.addressBook.ContactsData).variables ??
        selectBoxArray
    ); // Get SelectBoxArray from API
    let obj: any = {};
    headersToFill.forEach((header: any, index: any, headerArr) => {
      header.forEach((head: any) => {
        obj[index] = {
          variableId: EnSelect.DISABLED,
          contacts: state.uploadedContacts.map(
            (contact: any) => contact[index]
          ),
        };
      });
    });
    console.log(obj);
    // CONTACTS
    setSelected(obj);

    selectRefs.current = headersToFill.map(
      (element: any, i: any) => selectRefs.current[i] ?? React.createRef()
    );

    trRefs.current = state.uploadedContacts.map(
      (element: any, idx: number) => trRefs.current[idx] ?? React.createRef()
    );
    // VARIABLES
    setHeaders(headersToFill);
    console.log(state.uploadedContacts);
  }, []);
  useEffect(() => {
    console.log({ selected }, headers[0]);
  }, [selected, setSelected, headers, setHeaders]);

  const updateAddressBook = async (data: any) => {
    return await new MailService()
      .UpdateContactList({
        ...state.addressBook,
        ContactsData: Utils.encodeBase64(data),
      })
      .then((data) => {
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          dispatch({
            type: "SUBMIT_CONTACTS",
          });
        }
      });
  };

  const addContacts = async () => {
    let isThereEmailOrPhone = Object.keys(selected).some((sel: any) => {
      return (
        selected[sel]["variableId"] === EnSelect.PHONE ||
        selected[sel]["variableId"] === EnSelect.EMAIL
      );
    });
    if (isThereEmailOrPhone) {
      let copyData: any[] = [];
      let finalData: any[] = [];
      let tempHeaders: any[] = [];
      for (let i = 0; i < state.uploadedContacts.length; i++) {
        copyData = state.uploadedContacts[i];
        tempHeaders = [...headers[0]];
        for (let j = 0; j < copyData.length; j++) {
          for (let k = 0; k < tempHeaders.length; k++) {
            if (
              tempHeaders[k].value === selected[j]["variableId"] &&
              tempHeaders[k].value !== EnSelect.DISABLED
            ) {
              tempHeaders[k].data = copyData[j];
            }
          }
          finalData.push(tempHeaders);
          tempHeaders = [];
          debugger;
        }
      }
      console.log(finalData);
      //dispatch({ type: "SUBMIT_CONTACTS" });
      //await updateAddressBook(null);
      // TODO: Call API service in ContactResult
    } else {
      message.error({
        content: "Select at least one email or phone!",
        duration: 1,
        key: "updatable",
      });
    }
  };

  const createVariable = (varName: string) => {
    let newId = 0;
    setHeaders((prev: any) => {
      const updHeaders = prev.map((selectElements: any, index: any) => {
        newId = selectElements.length;
        return [
          ...selectElements,
          {
            value: newId,
            title: varName,
          },
        ];
      });
      return updHeaders;
    });
    // On the clicked dropdown make the default selected variable the one that was created
    const currentTarget = selectRefs.current.find(
      (el) => +el.current.dataset.id === state.selectId
    );
    currentTarget.current.focus();

    currentTarget.current.value = newId;
    setSelected((prev: any) => {
      return {
        ...prev,
        [+currentTarget.current.dataset.id!]: {
          variableId: newId,
          contacts: prev[+currentTarget.current.dataset.id!].contacts,
        },
      };
    });
    dispatch({ type: "HIDE_CREATE_VISIBLE" });
  };
  return (
    <div>
      <CreateVariableModal createVariable={createVariable} />
      <div className="preview-table">
        <table className="preview-table__upload">
          <tbody>
            <tr>
              {headers.map((item, index) => (
                <th key={index}>
                  <div>
                    <select
                      className="preview-table__select"
                      data-id={index}
                      ref={selectRefs.current[index]}
                      value={selected[index].variableId}
                      onChange={(event) => {
                        const target = event.target;
                        if (+target.value === EnSelect.CREATE) {
                          dispatch({
                            type: "SHOW_CREATE_VISIBLE",
                            selectId: +target.dataset.id!,
                          });
                        }
                        setSelected((prev: any) => {
                          if (target)
                            return {
                              ...prev,
                              [+target.dataset.id!]: {
                                variableId: +target.value,
                                contacts: prev[+target.dataset.id!].contacts,
                              },
                            };
                        });
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
            {state.uploadedContacts.map((item: any, index: any) => {
              let diff = 0;
              if (item.length < largestOrigin.length) {
                diff = largestOrigin.length - item.length;
                for (let i = 0; i < diff; i++) {
                  item.push("-"); // Complect empty columns
                }
              }
              return (
                <tr key={index} ref={trRefs.current[index]}>
                  {item.map((elm: any, tdIndex: any) => {
                    if (!elm) {
                      return;
                    }
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
export default ContactTable;
