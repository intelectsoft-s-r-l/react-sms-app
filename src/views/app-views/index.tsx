import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "../../components/shared-components/Loading";
import { APP_PREFIX_PATH } from "../../configs/AppConfig";

export const AppViews = () => {
  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Switch>
        <Route
          path={`${APP_PREFIX_PATH}/dashboard`}
          component={lazy(() => import(`./dashboard`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/campaign`}
          component={lazy(() => import(`./campaign`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/tariffs`}
          component={lazy(() => import(`./tariffs`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/settings`}
          component={lazy(() => import(`./settings`))}
        />
        <Route
          path={`${APP_PREFIX_PATH}/account-settings`}
          component={lazy(() => import(`./account-settings`))}
        />
        <Redirect
          from={`${APP_PREFIX_PATH}`}
          to={`${APP_PREFIX_PATH}/dashboard`}
        />
      </Switch>
    </Suspense>
  );
};

export default React.memo(AppViews);
