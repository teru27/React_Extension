import { type FC } from "react";
import { Accordion } from "./Accordion";
import "./modal.css";

interface voicevoxCmpType {}

export const VoicevoxCmp: FC<voicevoxCmpType> = (props) => {
  return (
    <>
      <div>
        <strong>voicevoxCmpType</strong>
      </div>
      <Accordion>
        <div>test</div>
      </Accordion>
    </>
  );
};
