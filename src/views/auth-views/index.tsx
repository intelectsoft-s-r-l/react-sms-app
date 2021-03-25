import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";
import Loading from "../../components/shared-components/Loading";
import { APP_NAME, AUTH_PREFIX_PATH } from "../../configs/AppConfig";

export const AuthViews = ({ match }: RouteComponentProps) => {
  useEffect(() => {
    document.title = APP_NAME;
  }, []);
  return (
    <Suspense fallback={<Loading cover="page" />}>
      <Switch>
        <Route
          path={`${match.url}/login`}
          component={lazy(() => import(`./authentication/login`))}
        />
        <Route
          path={`${match.url}/register`}
          component={lazy(() => import(`./authentication/register`))}
        />
        <Route
          path={`${match.url}/forgot-password`}
          component={lazy(() => import(`./authentication/forgot-password`))}
        />
        <Route
          path={`${match.url}/404`}
          component={lazy(() => import(`./errors/error-page-1`))}
        />
        <Redirect from={AUTH_PREFIX_PATH} to={`${AUTH_PREFIX_PATH}/login`} />
        {/*<Route*/}
        {/*  path={`${match.url}/error-2`}*/}
        {/*  component={lazy(() => import(`./errors/error-page-2`))}*/}
        {/*/>*/}
      </Switch>
    </Suspense>
  );
};

export default AuthViews;
