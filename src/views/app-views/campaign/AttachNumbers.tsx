import * as React from "react";
import { SetStateAction, Dispatch } from "react";
import { UploadOutlined } from "@ant-design/icons";
import Upload, { UploadChangeParam } from "antd/lib/upload";
import Utils from "utils";
import { Button } from "antd";

interface IAttachNumbers {
  setPhoneNumbers: Dispatch<SetStateAction<any[]>>;
  isCsvOrTxt: boolean;
  setIsCsvOrTxt: Dispatch<SetStateAction<boolean>>;
}
const AttachNumbers = ({
  setPhoneNumbers,
  isCsvOrTxt,
  setIsCsvOrTxt,
}: IAttachNumbers) => {
  const onChange = (info: UploadChangeParam<any>) => {
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let numArr: string = e.target.result
          .split(/[\s\n\r;*\/]+/)
          .filter((el: string) => el !== "")
          .join(",");
        setPhoneNumbers((prev) => [
          ...prev,
          { name: info.file.originFileObj.name, value: numArr },
        ]);
      };
      reader.readAsText(info.file.originFileObj);
    }
  };
  return (
    <div className="mb-3">
      <Upload
        // @ts-ignore
        beforeUpload={async (file: RcFile) => {
          return await Utils.beforeUploadNumbers(file).then((canUpload) => {
            if (canUpload) setIsCsvOrTxt(true);

            return canUpload;
          });
        }}
        onChange={onChange}
        multiple={true}
        customRequest={Utils.dummyRequest}
        showUploadList={{
          showRemoveIcon: false,
          showPreviewIcon: isCsvOrTxt,
        }}
      >
        <Button icon={<UploadOutlined />}>Choose file</Button>
      </Upload>
    </div>
  );
};
export default AttachNumbers;
