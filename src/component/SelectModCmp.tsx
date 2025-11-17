import { useEffect, useState, type FC, type JSX } from "react";

import { VoicevoxCmp } from "./VoicevoxCmp";
import { WebSpeechAPI } from "./WebSpeechAPICmp";

import "./modal.css";

interface SelectModCmpProps {}

type mode = "web-api" | "voicevox";

export const SelectModCmp: FC<SelectModCmpProps> = (props) => {
  const {} = props;
  const modes: mode[] = ["web-api", "voicevox"];
  const [getSelectMode, setSelectMode] = useState<mode>("web-api");

  const changeMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectMode(e.target.value as mode);
  };
  const [getContent, setContent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    switch (getSelectMode) {
      case "voicevox":
        setContent(<VoicevoxCmp />);
        break;
      default:
      case "web-api":
        setContent(<WebSpeechAPI />);
        break;
    }
  }, [getSelectMode]); // ← 依存配列にモードを入れる

  return (
    <>
      <div className="select-mode">
        <select value={getSelectMode} onChange={(e) => changeMode(e)}>
          {modes.map((mode) => (
            <option value={mode}>{mode}</option>
          ))}
        </select>
      </div>
      {getContent}
    </>
  );
};
