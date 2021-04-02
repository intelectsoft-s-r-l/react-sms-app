import * as React from "react";
import { Card } from "antd";
import "./phone.scss";

const MAX_LENGTH = 160;
function chunkText(str: string, size: number) {
  if (typeof str === "string") {
    const msgChunks = Array(Math.ceil(str.length / size));
    for (let i = 0, index = 0; index < str.length; i++) {
      msgChunks[i] = str.slice(index, (index += size));
    }
    return msgChunks;
  }
}
// Max character length depends on ASCII, if it's not ASCII it's 160, else it's 60
type PhoneType = {
  message: string;
  currentSms: number;
  MAX_SMS: number;
};
const Phone = ({ message, currentSms, MAX_SMS }: any) => {
  return (
    <Card>
      <div className="phone">
        <div className="sender">{"IntelectSoft SMS"}</div>
        <div className="main-screen">
          <div className="sms-preview">
            <div className="messages">
              {Array(currentSms)
                // @ts-ignore
                .fill()
                .map((_: any, i: any, arr: any[]) => (
                  <div
                    className={`message ${arr.length === i + 1 ? "last" : ""}`}
                    id={`sms_id_${i + 1}`}
                    key={i + 1}
                  >
                    {chunkText(message, MAX_SMS)![i] ?? ""}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default Phone;
