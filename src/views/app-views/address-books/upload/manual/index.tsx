import * as React from "react";
import { Input, Form, Button, Alert, Card } from "antd";
import { useQuery } from "utils/hooks/useQuery";
import { RouteComponentProps } from "react-router";
import { UploadContext } from "../uploadContext";
import { IUploadProps } from "../";
import Utils from "utils";

const InsertManually = (props: IUploadProps) => {
  const { uploadContacts } = props;
  const query = useQuery();
  const { state, dispatch } = React.useContext(UploadContext);
  const onFinish = ({ Contacts }: any) => {
    const data = Utils.CSVToArray(Contacts);
    uploadContacts(data);
    dispatch({ type: "SET_HAS_UPLOADED" });
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
          <Input.TextArea
            rows={6}
            placeholder="373797979, variable1,variable2...
373787878, variable1,variable2...
or
example@email.com, variable1,variable2...
example2@email.com, variable1,variable2..."
          />
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
