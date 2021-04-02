import { SMS_ID } from "constants/ApiConstant";
import { UPDATE_APP } from "redux/constants/App";

const initState = {};
const app = (state = initState, action: any) => {
  switch (action.type) {
    case UPDATE_APP:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return { ...state };
  }
};
export default app;
