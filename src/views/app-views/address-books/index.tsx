import * as React from "react";
import { useState, useEffect } from "react";
import { BookOutlined } from "@ant-design/icons";
import AddressBooksItem from "./AddressBooksItem";
import { Route, RouteComponentProps, Switch } from "react-router";
import { Button, Empty } from "antd";
import AddressBookModal from "./AddressBookModal";
import Upload from "./upload";
import BookItem from "./item";
import { ContactList } from "api/mail/types";
import { MailService } from "api/mail";
import { EnErrorCode } from "api";

export async function setAddressBooks(addressBook: any) {
  const book = JSON.parse(localStorage.getItem("address-books") ?? "[]");
  book.push(addressBook);
  localStorage.setItem("address-books", JSON.stringify(book));
}
export function getAddressBooks() {
  return JSON.parse(localStorage.getItem("address-books")!);
}
export function deleteAddressBook(id: number) {
  const books = JSON.parse(localStorage.getItem("address-books") ?? "[]");
  const newBooks = books.filter((elem: any) => elem.id !== id);
  localStorage.setItem("address-books", JSON.stringify(newBooks));
}
export function addContactNumbers(id: number, numbers: number[]) {
  const books = JSON.parse(localStorage.getItem("address-books") ?? "[]");
  const bookToBeUpdated = books.find((elem: any) => elem.id === id);
  bookToBeUpdated["Contacts"] = numbers;
  books.push(bookToBeUpdated);
  // @ts-ignore
  localStorage.setItem("address-books", JSON.stringify([...new Set(books)]));
}
const AddressBooks = (props: RouteComponentProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addressBooks, setAddressBooks] = useState<ContactList[]>([]);

  const getAddressBooks = async () => {
    return await new MailService().GetContactLists().then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        setAddressBooks(data.ContactsLists);
      }
    });
  };

  const updateAddressBooks = async (data: ContactList) => {
    return await new MailService().UpdateContactList(data).then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        getAddressBooks();
      }
    });
  };
  useEffect(() => {
    (async function dummyFunction() {
      await getAddressBooks();
    })();
  }, []);
  return (
    <Switch>
      <Route exact path={props.match.url}>
        <AddressBookModal
          visible={modalVisible}
          close={() => setModalVisible(false)}
          updateAddressBooks={updateAddressBooks}
        />
        <Button
          type="primary"
          onClick={() => setModalVisible(true)}
          className="mb-4"
        >
          <BookOutlined />
          New address book
        </Button>
        {addressBooks.map((book, idx: number) => (
          <AddressBooksItem {...book} {...props} key={idx + 1} />
        ))}
      </Route>
      <Route path={props.match.url + "/upload"}>
        <Upload {...props} />
      </Route>
      <Route path={props.match.url + "/item"}>
        <BookItem {...props} />
      </Route>
    </Switch>
  );
};
export default AddressBooks;
