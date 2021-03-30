import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "configs/AppConfig";
import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { getProfileInfo } from "redux/actions/Account";
import { authenticated } from "redux/actions/Auth";
import { IState } from "redux/reducers";
import { useQuery } from "utils/hooks/useQuery";

function Validate(props: RouteComponentProps) {
  const dispatch = useDispatch();
  const query = useQuery();
  const Token = useSelector((state: IState) => state.auth?.token);
  useEffect(() => {
    try {
      if (query.get("id")) {
        dispatch(authenticated(query.get("id")!.toString()));
        dispatch(getProfileInfo());
        if (Token) props.history.push(APP_PREFIX_PATH);
      }
    } catch {
      props.history.push(AUTH_PREFIX_PATH);
    }
  }, []);
  return <div>Loading...</div>;
}
export default Validate;
