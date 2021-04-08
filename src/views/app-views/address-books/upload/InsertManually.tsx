import * as React from "react";
import { Input, Form, Button, Alert } from "antd";
import { useQuery } from "utils/hooks/useQuery";
import { addContactNumbers } from "..";
import { RouteComponentProps } from "react-router";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const InsertManually = (props: RouteComponentProps) => {
  const query = useQuery();
  const onFinish = (values: any) => {
    addContactNumbers(+query.get("id")!, values.Contacts.split(","));
    props.history.push(props.match.url);
  };
  return (
    <Form {...layout} onFinish={onFinish}>
      <Form.Item {...tailLayout}>
        <Alert banner message="Each number should be followed by comma!" />
      </Form.Item>
      <Form.Item
        name="Contacts"
        label="Contacts"
        className="w-100"
        rules={[
          {
            required: true,
            message: "Please input the contacts!",
          },
          {
            pattern: /^\d+(,\d+)*$/,
            message: "Numbers should be followed by comma!",
          },
        ]}
      >
        <Input.TextArea placeholder="373797979,373787878..." />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Upload
        </Button>
      </Form.Item>
    </Form>
  );
};
export default InsertManually;
