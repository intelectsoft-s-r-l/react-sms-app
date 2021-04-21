import * as React from "react";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
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
import { ROW_GUTTER } from "constants/ThemeConstant";
import Utils from "utils";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadContext } from "../uploadContext";
import { IUploadProps } from "../";

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

const UploadFile = (props: IUploadProps) => {
  const { state, dispatch } = React.useContext(UploadContext);
  const query = useQuery();
  const { uploadContacts } = props;
  const onFinish = async () => {
    if (!state.uploadedContacts) {
      return;
    }
    dispatch({
      type: "SET_HAS_UPLOADED",
    });
  };

  const onChange = (info: UploadChangeParam<any>) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.readAsText(info.file.originFileObj);
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const data: Array<string[]> = Utils.CSVToArray(
          ev.target!.result as string
        );
        uploadContacts(data);
        message.success("Contacts imported");
      };
    }
  };
  const isMobile = Utils.getBreakPoint(Grid.useBreakpoint()).includes("xl");

  return (
    <Card style={{ maxWidth: "100%", width: "100%" }}>
      <Form layout="vertical" style={{ width: "100%" }} onFinish={onFinish}>
        <Row gutter={ROW_GUTTER}>
          <Col xl={14}>
            <Form.Item
              name="FileToUpload"
              label="Select file"
              required
              className="mt-3"
            >
              <Upload.Dragger
                onChange={onChange}
                showUploadList={false}
                accept={".txt, .csv"}
                customRequest={Utils.dummyRequest}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to the area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other band files
                </p>
              </Upload.Dragger>
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
          <Col xl={9} style={{ display: "flex", alignItems: "center" }}>
            <div>
              {listData.map((item) => (
                <div>
                  <h5 style={{ color: "#3e82f7", margin: 0 }}>{item.title}</h5>
                  <p className="ml-2">{item.description}</p>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
export default UploadFile;
