import { Input } from "antd";
import Button, { ButtonType } from "antd/lib/button";
import { LiteralUnion } from "antd/lib/_util/type";
import CardToolbar from "components/util-components/DemoCard/CardToolbar";
import * as React from "react";

type SettingsControllerProps = {
  title: React.ReactNode | string;
  isDisabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name: string;
  copyText?: boolean;
  value: string | number | undefined;
  inputType?: LiteralUnion<
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week",
    string
  >;
  buttonType?: ButtonType;
  onDelete?: () => void;
  onSubmit: () => void;
  readOnly: boolean;
};
function SettingsController(props: SettingsControllerProps) {
  const {
    title,
    isDisabled = false,
    onChange,
    name,
    copyText = true,
    value,
    inputType = "text",
    buttonType = "ghost",
    onDelete,
    onSubmit,
    readOnly = false,
  } = props;
  return (
    <>
      <div className="container-fluid">
        <h2>{title}</h2>
      </div>
      <Input
        autoComplete={"false"}
        onChange={onChange}
        disabled={isDisabled}
        readOnly={readOnly}
        type={inputType}
        value={value}
        name={name}
        suffix={
          copyText && (
            <CardToolbar code={value} expand={() => false} isExpand="false" />
          )
        }
      />
      <div className="mt-3">
        <Button type={buttonType} onClick={onSubmit}>
          Submit
        </Button>
        {onDelete && (
          <Button danger onClick={onDelete} className="ml-3">
            Delete
          </Button>
        )}
      </div>
    </>
  );
}
export default SettingsController;
