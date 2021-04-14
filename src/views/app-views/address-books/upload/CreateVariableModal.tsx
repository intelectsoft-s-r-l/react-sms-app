import * as React from "react";
import { useState } from "react";
import { Input, Modal } from "antd";
import { UploadContext } from "./uploadContext";

interface ICreateVariableModal {
  createVariable: (name: string) => void;
}
const CreateVariableModal = (props: ICreateVariableModal) => {
  const { state, dispatch } = React.useContext(UploadContext);
  const [varName, setVarName] = useState<string>("");
  return (
    <Modal
      title="Create variable"
      onOk={() => {
        props.createVariable(varName);
      }}
      onCancel={() => {
        dispatch({ type: "HIDE_CREATE_VISIBLE" });
      }}
      visible={state.isCreateVisible}
    >
      <Input value={varName} onChange={(e) => setVarName(e.target.value)} />
    </Modal>
  );
};
export default CreateVariableModal;
