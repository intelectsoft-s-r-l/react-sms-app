import { combineReducers } from "redux";
import Auth, { IAuth } from "redux/reducers/Auth";
import Theme, { ITheme } from "redux/reducers/Theme";
import Account, { IAccount } from "redux/reducers/Account";
export interface IState {
  theme?: ITheme;
  account?: IAccount;
  auth?: IAuth;
}

const reducers = combineReducers({
  theme: Theme,
  auth: Auth,
  account: Account,
});

export default reducers;
