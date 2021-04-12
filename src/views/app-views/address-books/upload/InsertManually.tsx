import * as React from "react";
import { Input, Form, Button, Alert, Card } from "antd";
import { useQuery } from "utils/hooks/useQuery";
import { addContactNumbers } from "..";
import { RouteComponentProps } from "react-router";

const InsertManually = (props: RouteComponentProps) => {
  const query = useQuery();
  const onFinish = (values: any) => {
    addContactNumbers(+query.get("id")!, values.Contacts.split(","));
    props.history.push(props.match.url);
  };
  return (
    <Card style={{ width: "40%" }}>
      <Form onFinish={onFinish} layout="vertical" className="mt-3">
        <Form.Item
          name="Contacts"
          label="Contacts"
          className="w-100"
          rules={[
            {
              required: true,
              message: "Please input the contacts!",
            },
            //{
            //pattern: /^\d+(,\d+)*$/,
            //message: "Numbers should be followed by comma!",
            //},
          ]}
        >
          <Input.TextArea placeholder="373797979,373787878..." />
        </Form.Item>
        <div className="d-flex justify-content-between">
          <p>
            <span style={{ color: "#ff6b72", opacity: 0.8 }}>*</span> Each
            contact should be on a separate line.
          </p>
          <Button type="primary" htmlType="submit">
            Upload
          </Button>
        </div>
      </Form>
    </Card>
  );
};
export default InsertManually;
