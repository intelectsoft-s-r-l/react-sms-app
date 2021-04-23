import Utils from "utils";
import { EnSelect } from "./UploadTable";
// @ts-ignore
import shortid from "shortid";

export const uploadState = {
  hasUploaded: false,
  hasVariables: false,
  uploadedContacts: [],
  lines: 0,
  emails: 0,
  phones: 0,
  isCreateVisible: false,
  selectId: 0,
  addressBook: null,
  selected: null,
  headers: [],
  canBeSend: false,
} as any;
type ContactInstance = {
  [index: number]: {
    variableId: number;
    contacts: string[];
  };
};
export type Headers = {
  value: number;
  title: string;
  isDefault?: boolean;
};
type SelectedType = {
  [index: number]: { variableId: number; contacts: string[] };
};
export const uploadReducer = (state = uploadState, action: any) => {
  switch (action.type) {
    case "UPLOAD_CONTACTS":
      const data: any[] = [];
      action.payload.forEach((contacts: string[], idx: number) => {
        let temp: any = {};
        const varKey = contacts.reduce((acc, elem) => {
          if (Utils.isEmail(elem)) {
            return "Email";
          }
          return "Phone";
        }, "");
        contacts
          .filter((elem) => elem.length)
          .forEach((elem) => {
            if (Utils.isEmail(elem)) {
              temp.Email = elem;
            } else {
              temp.Phone = elem;
            }
            temp.id = shortid.generate();
          });
        data.push(temp);
      });
      return {
        ...state,
        uploadedContacts: data,
        hasVariables: false,
      };
    case "UPLOAD_CONTACTS_WITH_VAR":
      const contacts = action.payload
        .map((contacts: string[]) =>
          contacts.filter((contact: string) => contact)
        )
        .filter((value: string) => JSON.stringify(value) !== "[]")
        .filter((value: string) => JSON.stringify(value) !== '[""]');
      const largestOrigin = Utils.getLargestArray(contacts);
      // Depending on the amount of columns, the amount of header arrays will be accordingly
      const headers: Headers[][] = new Array(largestOrigin.length).fill(
        action.headers
      );
      let selected: SelectedType = {};
      headers.forEach((_: Headers[], index: number) => {
        selected[index] = {
          // TODO: Check if there are emails/phones and set the variableId accordingly
          variableId: EnSelect.DISABLED,
          contacts: contacts.map((contact: string[]) => contact[index]),
        };
      });
      return {
        ...state,
        uploadedContacts: contacts,
        headers,
        selected,
        hasVariables: true,
      };
    case "ON_SELECT_CHANGE":
      // change selected state
      const { target } = action;
      return {
        ...state,
        selected: {
          ...state.selected,
          [+target.dataset.id]: {
            variableId: +target.value,
            contacts: state.selected[+target.dataset.id].contacts ?? [],
          },
        },
      };
    case "SET_HAS_UPLOADED":
      return {
        ...state,
        hasUploaded: true,
      };
    case "CREATE_VARIABLE": {
      // change both headers and selected state
      const { target, id, variableName } = action;
      return {
        ...state,
        headers: state.headers.map((elements: any, index: number) => {
          return [
            ...elements,
            {
              value: id,
              title: variableName,
              isDefault: false,
            },
          ];
        }),
        selected: {
          ...state.selected,
          [+target.dataset.id!]: {
            variableId: id,
            contacts: state.selected[+target.dataset.id].contacts,
          },
        },
        isCreateVisible: false,
      };
    }
    case "SET_ADDRESSBOOK":
      return {
        ...state,
        addressBook: action.payload,
      };
    case "SUBMIT_CONTACTS": {
      return {
        ...state,
        hasVariables: false,
        uploadedContacts: action.payload,
        headers: action.headers,
      };
    }
    case "SHOW_CREATE_VISIBLE":
      return {
        ...state,
        isCreateVisible: true,
        selectId: action.selectId,
      };
    case "HIDE_CREATE_VISIBLE":
      return {
        ...state,
        isCreateVisible: false,
      };
    default:
      return state;
  }
};
