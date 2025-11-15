import { useState, type FC } from "react";

import { Modal } from "../component/Modal";
import { VoicevoxCmp } from "../component/voicevoxCmp";
import { WebSpeechAPI } from "../component/WebSpeechAPICmp";
import "./modalView.css";

interface ModalViewProps {}

type mode = "web-api" | "voicevox";

export const ModalView: FC<ModalViewProps> = (props) => {
  const {} = props;

  const [getSelectMode, setSelectMode] = useState<mode>("web-api");

  const changeMode = (selectModo: mode) => {
    setSelectMode(selectModo);
  };

  return (
    <>
      <Modal>
        {getSelectMode == "web-api" ? (
          <>
            <button onClick={() => changeMode("voicevox")}>
              voicevoxへ変更
            </button>
            <WebSpeechAPI />
          </>
        ) : (
          <>
            <button onClick={() => changeMode("web-api")}>web-apiへ変更</button>
            <VoicevoxCmp />
          </>
        )}
      </Modal>
    </>
  );
};
