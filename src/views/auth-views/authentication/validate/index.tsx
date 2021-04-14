import { APP_PREFIX_PATH, AUTH_PREFIX_PATH, DOMAIN } from "configs/AppConfig";
import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { getProfileInfo } from "redux/actions/Account";
import { authenticated } from "redux/actions/Auth";
import { IState } from "redux/reducers";
import { useQuery } from "utils/hooks/useQuery";
import Cookies from "js-cookie";
import Utils from "utils";

function Validate(props: RouteComponentProps) {
  const dispatch = useDispatch();
  const query = useQuery();

  useEffect(() => {
    if (Boolean(query.get("isManage"))) {
      sessionStorage.setItem("c_id", query.get("company_id")!);
      Utils.setManageToken(query.get("company_id")!, query.get("token")!);
      props.history.push(APP_PREFIX_PATH);
    } else {
      Utils.setToken(query.get("token")!);
      props.history.push(APP_PREFIX_PATH);
    }
  }, []);
  return <div>Loading...</div>;
}
export default Validate;
