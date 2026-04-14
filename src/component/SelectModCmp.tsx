import { useEffect, useState, type FC, type JSX } from "react";

import { VoicevoxCmp } from "./VoicevoxCmp";
import { WebSpeechAPI } from "./WebSpeechAPICmp";

import "./modal.css";

interface SelectModCmpProps {}

type mode = "web-api" | "voicevox";

export const SelectModCmp: FC<SelectModCmpProps> = (props) => {
  const {} = props;
  const modes: mode[] = ["web-api", "voicevox"];
  const [getSelectMode, setSelectMode] = useState<mode>("voicevox");

  const changeMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectMode(e.target.value as mode);
  };
  const [getContent, setContent] = useState<JSX.Element>(<></>);

  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("debugMode");
    if (!saved) {
      localStorage.setItem("debugMode", "0");
    } else {
      setDebugMode(saved === "1");
      console.log("Debug Mode:", saved === "1" ? "ON" : "OFF");
    }
  }, [debugMode]);

  useEffect(() => {
    switch (getSelectMode) {
      case "voicevox":
        setContent(<VoicevoxCmp mode={debugMode} />);
        break;
      default:
      case "web-api":
        setContent(<WebSpeechAPI mode={debugMode} />);
        break;
    }
  }, [getSelectMode, debugMode]); // ← 依存配列にモードを入れる

  return (
    <>
      <div className="select-mode">
        <select value={getSelectMode} onChange={(e) => changeMode(e)}>
          {modes.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>
      <div className="mode-content">{getContent}</div>
    </>
  );
};
