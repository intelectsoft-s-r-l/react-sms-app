import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "antd";
import Utils from "utils";
import "./table.scss";
import { UploadContext } from "./uploadContext";
import CreateVariableModal from "./CreateVariableModal";

enum EnSelect {
  DISABLED = 0,
  PHONE = 1,
  EMAIL = 2,
  NAME = 3,
  GENDER = 4,
  AGE = 5,
  CREATE = 100,
}
const selectBoxArray = [
  {
    value: EnSelect.DISABLED,
    title: "Disabled",
  },
  {
    value: EnSelect.CREATE,
    title: "Create variable",
  },
  {
    value: EnSelect.PHONE,
    title: "Phone",
  },
  {
    value: EnSelect.EMAIL,
    title: "Email",
  },
  {
    value: EnSelect.NAME,
    title: "Name",
  },
  {
    value: EnSelect.AGE,
    title: "Age",
  },
  {
    value: EnSelect.GENDER,
    title: "Gender",
  },
];
function ContactTable() {
  //const { contacts } = props;
  const { state, dispatch } = React.useContext(UploadContext);
  const [headers, setHeaders] = useState<any[]>([]);
  const [temp, setTemp] = useState<any[]>([
    ["37373", "vlad", "1999"],
    ["373737", "greta", "1998"],
  ]);
  const [selected, setSelected] = useState<any>();
  useEffect(() => {
    const largestOrigin = Utils.getLargestArray(state.contacts);
    const headersToFill = new Array(largestOrigin.length).fill(selectBoxArray);
    let obj: any = {};
    headersToFill.forEach((header: any, index: any, headerArr) => {
      header.forEach((head: any) => {
        obj[index] = {
          value: EnSelect.DISABLED,
          contacts: state.contacts.map((contact: any) => contact[index]),
        };
      });
    });
    // CONTACTS
    setSelected(obj);
    // VARIABLES
    setHeaders(headersToFill);
  }, []);
  useEffect(() => {
    console.log(selected);
  }, [selected, setSelected]);

  const createVariable = (varName: string) => {
    setHeaders((prev: any) => {
      const updHeaders = prev.map((selectElements: any) => {
        return [
          ...selectElements,
          {
            value: selectElements.length + 1,
            title: varName,
          },
        ];
      });
      return updHeaders;
    });
    dispatch({ type: "HIDE_CREATE_VISIBLE" });
    // TODO: On the clicked dropdown make the default selected variable the one that was created
    setSelected((prev: any) => {
      return {
        ...prev,
      };
    });
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
                      value={selected ? selected.value : EnSelect.DISABLED}
                      onChange={(event) => {
                        const target = event.target;
                        if (+target.value === EnSelect.CREATE) {
                          dispatch({ type: "SHOW_CREATE_VISIBLE" });
                        }
                        setSelected((prev: any) => {
                          if (target)
                            return {
                              ...prev,
                              [+target.dataset.id!]: {
                                value: +target.value,
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
            {state.contacts &&
              state.contacts.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    {item.map((elm: any, tdIndex: any) => {
                      if (!elm) {
                        return;
                      }
                      return <td key={tdIndex}>{elm}</td>;
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Button type="primary">Add</Button>
    </div>
  );
}
export default ContactTable;
