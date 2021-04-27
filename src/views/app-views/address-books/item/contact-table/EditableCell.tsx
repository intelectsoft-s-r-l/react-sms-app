import * as React from "react";
import { Form, Input } from "antd";
import { EditableContext } from ".";
import "./contact-table.scss";

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}
const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = React.useState<boolean>(false);
  const inputRef = React.useRef<Input>(null);
  const form = React.useContext(EditableContext)!;

  React.useEffect(() => {
    if (editing) {
      inputRef!.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    // Validate new value
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch {}
  };
  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        name={dataIndex}
        style={{
          display: "block",
          marginBottom: "0",
        }}
      >
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          style={{
            borderRadius: 5,
            margin: 0,
            height: 40,
            padding: "4px 0 4px 6px",
          }}
        />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }
  return (
    <td
      {...restProps}
      style={{
        width: "100px",
        left: "-6px",
      }}
    >
      {childNode}
    </td>
  );
};
export default EditableCell;
