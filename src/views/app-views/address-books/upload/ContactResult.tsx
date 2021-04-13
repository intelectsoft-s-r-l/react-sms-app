import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, Button } from "antd";
import ContactTable from "./ContactTable";

function ContactResult(props: any) {
  return (
    <>
      <Alert
        type="success"
        message="Ready! Addresses successfully added"
        className="mb-3"
      />
      <ContactTable {...props} />
      <Button>View contacts</Button>
    </>
  );
}

export default ContactResult;
