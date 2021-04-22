import * as React from "react";
import { Tooltip, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface IContactActions {
  id: string;
  deleteRowItem: (id: string) => void;
}
function ContactActions({ id, deleteRowItem }: IContactActions) {
  return (
    <div className="text-right">
      <Tooltip title={"Delete contact"}>
        <Button
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => {
            deleteRowItem(id);
          }}
        />
      </Tooltip>
    </div>
  );
}
export default ContactActions;
