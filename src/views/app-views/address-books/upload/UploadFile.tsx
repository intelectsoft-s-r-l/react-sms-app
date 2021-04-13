import * as React from "react";
import { useState } from "react";
import {
  Form,
  Button,
  Divider,
  Row,
  Col,
  Card,
  Upload,
  Grid,
  message,
} from "antd";
import { useQuery } from "utils/hooks/useQuery";
import { addContactNumbers } from "..";
import { ROW_GUTTER } from "constants/ThemeConstant";
import Utils from "utils";
import { UploadChangeParam } from "antd/lib/upload";
import ContactResult from "./ContactResult";

const listData = [
  {
    title: "Step 1. Get familiar with the file format",
    description:
      "Supported file formats are: CSV, TXT. Each contact should be on a separate line.",
  },
  {
    title: "Step 2.",
    description: `Choose the file to import.`,
  },
  {
    title: "Step 3. Upload",
    description:
      "Upload the files into the form. Files will be added to the address book.",
  },
];

const UploadFile = () => {
  const query = useQuery();
  const [phoneNumbers, setPhoneNumbers] = useState<number[]>([]);
  const [isCorrectFormat, setIsCorrectFormat] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Array<string[]>>([]);
  const [hasUploaded, setHasUploaded] = useState<boolean>(false);
  //const onFinish = () => {
  //addContactNumbers(+query.get("id")!, phoneNumbers);
  //window.location.reload();
  //};
  const onFinish = () => {
    if (!contacts) {
      return;
    }

    setHasUploaded(true);
  };

  const jsonDataArray = (array: any) => {
    let headers = array[0].split(",");
    let jsonData = [];
    for (let i = 1, length = array.length; i < length; i++) {
      let row = array[i].split(",");
      console.log(row);
      let data: Array<Array<string>> = [];
      for (let x = 0; x < row.length; x++) {
        data[headers[x]] = row[x];
      }
      jsonData.push(data);
    }
    return jsonData;
  };

  const onChange = (info: UploadChangeParam<any>) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.readAsText(info.file.originFileObj);
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const data: Array<string[]> = Utils.CSVToArray(
          ev.target!.result as string
        );
        setContacts(data);
        message.success("Contacts imported!");
      };
    }
  };
  const isMobile = Utils.getBreakPoint(Grid.useBreakpoint()).includes("xl");

  if (hasUploaded === false) {
    return <ContactResult contacts={contacts} />;
  }

  return (
    <Card className="w-75">
      <Form layout="vertical" style={{ width: "100%" }} onFinish={onFinish}>
        <Row gutter={ROW_GUTTER}>
          <Col xl={14}>
            <Form.Item
              name="FileToUpload"
              label="Select file"
              required
              className="mt-3"
            >
              <Upload
                onChange={onChange}
                showUploadList={false}
                accept={".txt, .csv"}
                customRequest={Utils.dummyRequest}
              >
                <Button style={{ width: "100%" }}>Browse</Button>
              </Upload>
            </Form.Item>
            <Form.Item className="text-right">
              <Button type="primary" htmlType="submit">
                Upload
              </Button>
            </Form.Item>
          </Col>
          <Col xl={1}>
            <Divider
              type="vertical"
              style={{ height: "100%", display: isMobile ? "" : "none" }}
            />
          </Col>
          <Col xl={9}>
            {listData.map((item) => (
              <div>
                <h5 style={{ color: "#3e82f7", margin: 0 }}>{item.title}</h5>
                <p className="ml-2">{item.description}</p>
              </div>
            ))}
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
export default UploadFile;
