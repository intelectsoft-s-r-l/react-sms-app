import * as React from "react";
import { Card } from "antd";
import "./phone.scss";

const MAX_LENGTH = 160;
function chunkText(str: string, size: number) {
  if (typeof str === "string") {
    const msgChunks = Array(Math.ceil(str.length / MAX_LENGTH));
    for (let i = 0, index = 0; index < str.length; i++) {
      msgChunks[i] = str.slice(index, (index += size));
    }
    return msgChunks;
  }
}
const Phone = ({ message, currentSms }: any) => {
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
                  >
                    {chunkText(message, MAX_LENGTH)![i] ?? ""}
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
