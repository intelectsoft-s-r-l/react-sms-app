import * as React from "react";
import { useState, useEffect } from "react";
import { Select, Input, FormInstance } from "antd";
import { MailService } from "api/mail";
import { EnErrorCode } from "api";
import { ContactList } from "api/mail/types";
import { OptionType } from "antd/lib/select";
import Utils from "utils";
function SelectReceivers({
  form,
  phones,
  setPhones,
}: {
  form: FormInstance<any>;
  phones: string | number;
  setPhones: React.Dispatch<React.SetStateAction<number | string>>;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [contactList, setContactList] = useState<ContactList[]>([]);
  const [isInsert, setIsInsert] = useState<boolean>(true);
  const getContactsLists = async () => {
    return await new MailService().GetContactLists().then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        setContactList(data.ContactsLists);
      }
    });
  };
  const getContactsList = async (ID: number) => {
    setLoading(true);
    return await new MailService().GetContactList(ID).then((data) => {
      setLoading(false);
      if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
        const contactsData = Utils.decodeBase64(data.ContactsList.ContactsData);
        return contactsData.contacts.map((elem: any) => elem.Phone);
      }
    });
  };
  useEffect(() => {
    (async function IIFE() {
      return await getContactsLists();
    })();
  }, []);
  const onChange = async (value: number) => {
    setPhones("");
    if (value === 0) {
      setIsInsert(true);
    } else {
      setIsInsert(false);
      const phones = await getContactsList(value);
      const PhoneList = phones.filter((elem: string) => elem).join(",");
      setPhones(PhoneList);
    }
  };
  return (
    <>
      <Select defaultValue={0} onChange={onChange} loading={loading}>
        <Select.Option value={0}>Insert manually</Select.Option>
        {contactList.map((item) => {
          return (
            <Select.Option value={+item.ID!} key={item.ID}>
              {item.Name}
            </Select.Option>
          );
        })}
      </Select>
      <Input.TextArea
        value={phones}
        onChange={(event) => setPhones(event.target.value)}
        placeholder="Type or paste phone numbers, numbers should be separated by comma."
        style={{ display: isInsert ? "block" : "none", marginTop: "10px" }}
      />
    </>
  );
}
export default SelectReceivers;
