import * as React from "react";
import { useEffect, useState } from "react";
import Utils from "utils";
import "./table.scss";

enum EnSelect {
  DISABLED = 0,
  PHONE = 1,
  EMAIL = 2,
  NAME = 3,
  CREATE = 100,
}
const selectBoxArray = [
  {
    id: 1,
    value: EnSelect.DISABLED,
    title: "Disabled",
  },
  {
    id: 2,
    value: EnSelect.CREATE,
    title: "Create variable",
  },
  {
    id: 3,
    value: EnSelect.PHONE,
    title: "Phone",
  },
  {
    id: 4,
    value: EnSelect.EMAIL,
    title: "Email",
  },
  {
    id: 5,
    value: EnSelect.NAME,
    title: "Name",
  },
];
function ContactTable(props: { contacts: any[] }) {
  const { contacts } = props;
  const [headers, setHeaders] = useState<any[]>([]);
  const [temp, setTemp] = useState<any[]>([
    ["37373", "vlad", "1999"],
    ["373737", "greta", "1998"],
  ]);
  const [selected, setSelected] = useState<any>();
  useEffect(() => {
    const largestOrigin = Utils.getLargestArray(temp);
    const headersToFill = new Array(largestOrigin.length).fill(selectBoxArray);
    let obj: any = {};
    headersToFill.forEach((header: any, index: any) => {
      header.forEach((head: any) => {
        obj[index] = { id: index, value: EnSelect.DISABLED };
        setSelected(obj);
      });
    });
    debugger;
    setHeaders(headersToFill);
  }, []);
  useEffect(() => {
    console.log(selected);
  }, [selected, setSelected]);
  return (
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
                      setSelected((prev: any) => {
                        if (target)
                          return {
                            ...prev,
                            [+target.dataset.id!]: {
                              id: +target.dataset.id!,
                              value: +target.value,
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
          {temp.map((item, index) => (
            <tr key={index}>
              {item.map((elm: any, tdIndex: any) => (
                <td key={tdIndex}>{elm}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ContactTable;
