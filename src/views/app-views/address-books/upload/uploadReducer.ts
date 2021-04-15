import Utils from "utils";
import { selectBoxArray } from "./ContactTable";

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
  contactsData: {
    contacts: null,
    variables: [],
  },
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
}[];
type SelectHeaderItem = {};
export const uploadReducer = (state = uploadState, action: any) => {
  switch (action.type) {
    case "SET_CONTACTS":
      return {
        ...state,
        uploadedContacts: action.payload,
      };
    case "SET_CONTACTS_WITH_VAR":
      return {
        ...state,
        uploadedContacts: action.payload,
        hasVariables: true,
      };
    case "GET_VARIABLES_AND_CONTACTS":
      const largestOrigin = Utils.getLargestArray(state.uploadedContacts);
      const headers: SelectHeader[] = new Array(largestOrigin.length).fill(
        Utils.decodeBase64(state.addressBook.ContactsData).variables ??
          selectBoxArray
      );
      let obj: ContactInstance = {};
      headers.forEach((header, index) => {
        header.forEach((head) => {
          obj[index] = {
            variableId: 0,
            contacts: state.uploadedContacts.map(
              (contact: any) => contact[index]
            ),
          };
        });
      });
      return {
        ...state,
        contactsData: {
          // selected
          contacts: obj,
          variables: headers[0],
        },
        headers,
      };
    case "UPDATE_CONTACTS":
      return {
        ...state,
        contactsData: {
          contacts: {
            ...state.contactsData.contacts,
            [action.contactId]: {
              variableId: [action.variableId],
              contacts: state.contactsData.contacts[action.variableId].contacts,
            },
          },
        },
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
