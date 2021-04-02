import { combineReducers } from "redux";
import Auth, { IAuth } from "redux/reducers/Auth";
import Theme, { ITheme } from "redux/reducers/Theme";
import Account, { IAccount } from "redux/reducers/Account";
import App from "redux/reducers/App";
import { IApp } from "api/client/types";
export interface IState {
  theme?: ITheme;
  account?: IAccount;
  auth?: IAuth;
  app: IApp;
}

const reducers = combineReducers({
  theme: Theme,
  auth: Auth,
  account: Account,
  app: App,
});

export default reducers;
