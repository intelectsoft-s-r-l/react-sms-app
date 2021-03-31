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

function Validate(props: RouteComponentProps) {
  const dispatch = useDispatch();
  const query = useQuery();

  useEffect(() => {
    try {
      if (query.get("token")) {
        Cookies.set("Token", query.get("token")!.toString(), {
          expires: 1,
          domain: DOMAIN,
          path: "/",
        });
        props.history.push(APP_PREFIX_PATH);
      }
    } catch {
      props.history.push(AUTH_PREFIX_PATH);
    }
  }, []);
  return <div>Loading...</div>;
}
export default Validate;
