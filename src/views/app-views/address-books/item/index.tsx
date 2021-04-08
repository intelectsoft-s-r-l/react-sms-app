import * as React from "react";
import { Card } from "antd";
import { useState, useEffect } from "react";
import { PageHeader, Result } from "antd";
import { RouteComponentProps } from "react-router";
import { useQuery } from "utils/hooks/useQuery";
import { Link } from "react-router-dom";
import ContactList from "./ContactList";
const BookItem = (props: RouteComponentProps) => {
  const query = useQuery();
  const [book, setBook] = useState<any | undefined>(undefined);
  useEffect(() => {
    setBook(
      JSON.parse(localStorage.getItem("address-books") ?? "[]").find(
        (elem: any) => elem.id == query.get("id")
      )
    );
  }, [query.get("id")]);
  if (!book) {
    return (
      <Result
        title="Address book not found"
        status="404"
        extra={<Link to={props.match.url}>Find your way</Link>}
      />
    );
  }
  return (
    <>
      <PageHeader
        title={<h1>{book.Name}</h1>}
        onBack={() => props.history.goBack()}
      />
      <Card>
        <ContactList />
      </Card>
    </>
  );
};
export default BookItem;
