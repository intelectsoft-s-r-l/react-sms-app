import * as React from "react";
import { useEffect } from "react";
import { Form, Input, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { ContactList } from "api/mail/types";

interface IAddressBookModal {
  visible: boolean;
  close: () => void;
  updateAddressBooks: (data: ContactList) => void;
}
const AddressBookModal = ({
  visible,
  close,
  updateAddressBooks,
}: IAddressBookModal) => {
  const [form] = useForm();

  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [visible]);
  const onFinish = async ({ Name }: any) => {
    updateAddressBooks({ Name });
  };
  return (
    <Modal
      title="New address book"
      onOk={() => {
        form.validateFields().then(async (values) => {
          await onFinish(values);
          // On finish redirect to upload contacts page
          close();
        });
      }}
      onCancel={() => close()}
      visible={visible}
    >
      <Form
        name="AddressBookAdd"
        form={form}
        initialValues={{
          Name: `My list ${moment().format("LTS")}`,
        }}
      >
        <Form.Item name="Name">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddressBookModal;
