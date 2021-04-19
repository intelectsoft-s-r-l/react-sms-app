import Utils from "utils";
import { EnSelect } from "./ContactTable";

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
  contacts: [],
  headers: [],
  canBeSend: false,
} as any;
type ContactInstance = {
  [index: number]: {
    variableId: number;
    contacts: string[];
  };
};
type SelectHeader = {
  value: number;
  title: string;
  isDefault: boolean;
}[];
type SelectHeaderItem = {};
export const selectBoxArray = [
  {
    id: EnSelect.DISABLED,
    title: "Disabled",
    isDefault: true,
  },
  {
    id: EnSelect.CREATE,
    title: "Create variable",
    isDefault: true,
  },
  {
    id: EnSelect.PHONE,
    title: "Phone",
    isDefault: true,
  },
  {
    id: EnSelect.EMAIL,
    title: "Email",
    isDefault: true,
  },
];
export const uploadReducer = (state = uploadState, action: any) => {
  switch (action.type) {
    case "UPLOAD_CONTACTS":
      return {
        ...state,
        uploadedContacts: action.payload,
      };
    case "UPLOAD_CONTACTS_WITH_VAR":
      return {
        ...state,
        uploadedContacts: action.payload,
        hasVariables: true,
      };
    case "SET_HEADERS":
      const largestOrigin = Utils.getLargestArray(state.uploadedContacts);
      const headers: SelectHeader[] = new Array(largestOrigin.length).fill(
        selectBoxArray // Get the headers from the API
      );
      console.log(headers);
      return {
        ...state,
        headers,
      };
    case "SET_CONTACTS":
      const contactsData: any[] = state.headers.map(
        (header: any, idx: number, array: any[]) => {
          return header.reduce((acc: any, currVal: any, idx: number) => {
            acc[currVal.title] = "";
            return { ...acc, id: header[idx].id };
          }, {});
        }
      );
      console.log(contactsData);
      return {
        ...state,
        contacts: contactsData,
      };
    case "SET_HAS_UPLOADED":
      return {
        ...state,
        hasUploaded: true,
      };
    case "CREATE_VARIABLE":
      let newId = 0;
      return {
        ...state,
        headers: state.headers.map((selectElements: any, index: any) => {
          newId = selectElements.length;
          return [
            ...selectElements,
            {
              value: newId,
              title: action.title,
            },
          ];
        }),
      };
    case "SET_ADDRESSBOOK":
      return {
        ...state,
        addressBook: action.payload,
      };
    case "SUBMIT_CONTACTS": {
      return {
        ...state,
        hasVariables: false,
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
