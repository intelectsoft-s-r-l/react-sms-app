import * as React from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router";
import Upload from "./upload";
import BookItem from "./item";
import BookList from "./list";

const AddressBooks = (props: RouteComponentProps) => {
  return (
    <Switch>
      <Route exact path={`${props.match.url}`}>
        <BookList {...props} />
      </Route>
      <Route path={`${props.match.url}/upload`} exact>
        <Upload {...props} />
      </Route>
      <Route path={`${props.match.url}/phones`} exact>
        <BookItem {...props} />
      </Route>
      <Route path={`${props.match.url}/emails`} exact>
        <BookItem {...props} />
      </Route>
    </Switch>
  );
};
export default AddressBooks;
