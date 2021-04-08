import * as React from "react";
import { useState } from "react";
import { Form, Button, Alert } from "antd";
import { useQuery } from "utils/hooks/useQuery";
import AttachNumbers from "views/app-views/campaign/AttachNumbers";
import { addContactNumbers } from "..";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const UploadFile = () => {
  const query = useQuery();
  const [phoneNumbers, setPhoneNumbers] = useState<number[]>([]);
  const [isCorrectFormat, setIsCorrectFormat] = useState<boolean>(true);
  const onFinish = () => {
    addContactNumbers(+query.get("id")!, phoneNumbers);
    window.location.reload();
  };
  return (
    <Form {...layout} onFinish={onFinish}>
      <Form.Item {...tailLayout}>
        <Alert banner message="Supported file formats: CSV, TXT" />
      </Form.Item>
      <Form.Item name="FileToUpload" {...tailLayout}>
        <AttachNumbers
          setPhoneNumbers={setPhoneNumbers}
          isCsvOrTxt={isCorrectFormat}
          setIsCsvOrTxt={setIsCorrectFormat}
        />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary">Upload</Button>
      </Form.Item>
    </Form>
  );
};
export default UploadFile;
