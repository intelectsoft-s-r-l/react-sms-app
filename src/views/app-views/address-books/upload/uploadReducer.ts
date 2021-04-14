export const uploadState = {
  hasUploaded: false,
  hasVariables: false,
  contacts: [],
  lines: 0,
  emails: 0,
  phones: 0,
  isCreateVisible: false,
} as any;
export const uploadReducer = (state = uploadState, action: any) => {
  switch (action.type) {
    case "SET_CONTACTS":
      return {
        ...state,
        contacts: action.payload,
      };
    case "SET_CONTACTS_WITH_VAR":
      return {
        ...state,
        contacts: action.payload,
        hasVariables: true,
      };
    case "SET_HAS_UPLOADED":
      return {
        ...state,
        hasUploaded: true,
      };
    case "SHOW_CREATE_VISIBLE":
      return {
        ...state,
        isCreateVisible: true,
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
