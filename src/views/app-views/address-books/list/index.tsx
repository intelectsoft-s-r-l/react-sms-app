import * as React from "react";
import { useState, useEffect } from "react";
import { BookOutlined } from "@ant-design/icons";
import { RouteComponentProps } from "react-router";
import { Button, Spin } from "antd";
import BookModal from "./BookModal";
import BookListItem from "./BookListItem";
import { ContactList } from "api/mail/types";
import { MailService } from "api/mail";
import { EnErrorCode } from "api";

function BookList(props: RouteComponentProps) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [addressBooks, setAddressBooks] = useState<ContactList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAddressBooks = async () => {
    return await new MailService().GetContactLists().then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        setAddressBooks(data.ContactsLists);
      }
    });
  };

  // Creates a new addressbook
  const updateAddressBooks = async (data: ContactList) => {
    return await new MailService().UpdateContactList(data).then((data) => {
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        getAddressBooks();
      }
    });
  };
  useEffect(() => {
    (async function IIFE() {
      return await getAddressBooks();
    })();
    return () => new MailService()._source.cancel();
  }, []);
  return (
    <>
      <Spin spinning={loading}>
        <BookModal
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
          <BookListItem
            {...book}
            {...props}
            key={idx + 1}
            getAddressBooks={getAddressBooks}
          />
        ))}
      </Spin>
    </>
  );
}
export default BookList;
