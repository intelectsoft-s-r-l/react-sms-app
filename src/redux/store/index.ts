import { applyMiddleware, compose, createStore } from "redux";
import reducers, { IState } from "redux/reducers";
import { loadState, saveState } from "utils/localStorage";
import throttle from "lodash/throttle";
import thunk, { ThunkAction } from "redux-thunk";

export type ThunkResult<ReturnType> = ThunkAction<
  ReturnType,
  IState,
  undefined,
  any
>;

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

function configureStore(preLoadedState: any) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(reducers, preLoadedState, compose(applyMiddleware(thunk)));
}

const store = configureStore(loadState());

store.subscribe(throttle(() => saveState(store.getState()), 1000));

export default store;
