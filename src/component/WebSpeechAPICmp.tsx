import { useEffect, useState, type FC } from "react";
import { Accordion } from "./Accordion";
import "./modal.css";
import { Slider } from "./Slider";

interface WebSpeechAPI {}

interface ITextToSpeech {
  text: string;
  lang: "en-US" | "ja-JP"; // ISO 639-1コードの形式
  speed: number; // 範囲: 0.1 ~ 10
  pitch: number; // 範囲: 0.1 ~ 10
  volume?: number; // 範囲: 0 ~ 1
  voiceName?: string; // 使用する音声の種類
}

export const WebSpeechAPI: FC<WebSpeechAPI> = (props) => {
  const [textDoms, setTextDoms] = useState<HTMLParagraphElement[]>([]);

  const [getPitch, setPitch] = useState<number>(2.0);
  const [getSpeed, setSpeed] = useState<number>(2.0);
  const [getVolume, setVolume] = useState<number>(1.0);
  const [get, set] = useState<boolean>(false);

  const handleClick = async () => {
    if (!document.getElementsByClassName("p-novel__text")) return;

    const div = document.getElementsByClassName("p-novel__text")[0];
    const p_texts = div.querySelectorAll("p");
    const textArr: HTMLParagraphElement[] = [];
    for (let i = 0; i < p_texts.length; i++) {
      // textDom.classList.add("highlight");
      // textDom.classList.remove("highlight")
      const textDom = p_texts[i];
      textArr.push(textDom);
    }
    setTextDoms(textArr);
  };

  // トランポリン関数（関数を繰り返し呼び出す）
  function trampoline(fn: (() => null) | null) {
    while (typeof fn === "function") {
      fn = fn();
    }
  }

  // 音声読み上げ関数（1つのテキストを読み上げて、次の関数を返す）
  function speakThunk(
    index: number,
    speed: number,
    pitch: number,
    volume: number
  ) {
    if (index >= textDoms.length) return null;

    return function trampolineStep() {
      // 読み上げ文
      const utterance = new SpeechSynthesisUtterance(
        textDoms[index].textContent
      );
      utterance.lang = "ja-JP";

      // 次のステップを返す関数（トランポリンの核）
      const nextStep = () =>
        speakThunk(index + 1, getSpeed, getPitch, getVolume);

      // 読み上げ終了後に次のステップを呼び出す
      utterance.onend = () => {
        trampoline(nextStep());
      };
      utterance.rate = speed;
      utterance.pitch = pitch;
      utterance.volume = volume;
      speechSynthesis.speak(utterance);
      speechSynthesis.resume();
      // 読み上げ中は次のステップを返さない（onendで呼ぶ）
      return null;
    };
  }
  const pause = () => {
    if (textDoms.length > 0) {
      speechSynthesis.pause();
      set(true);
    }
  };

  const resume = () => {
    if (textDoms.length > 0) {
      speechSynthesis.resume();
      set(false);
    }
  };

  useEffect(() => {
    console.log(textDoms);
    trampoline(speakThunk(0, getSpeed, getPitch, getVolume));
  }, [textDoms]);

  return (
    <div>
      <button onClick={handleClick}>取得する</button>

      {get ? (
        <button onClick={resume}>再生</button>
      ) : (
        <button onClick={pause}>停止</button>
      )}
      <Accordion>
        <>
          <Slider
            min={"0.0"}
            max={"10"}
            step={"0.1"}
            value={getPitch}
            setValue={setPitch}
          />
        </>
        <div>
          speed:{getSpeed.toFixed(1)}
          <input
            type="range"
            id="volume"
            value={getSpeed}
            onChange={(event) => {
              setSpeed(event.target.valueAsNumber);
            }}
            min="0.0"
            max="10"
            step="0.1"
          ></input>
        </div>
        <div>
          volume:{getVolume.toFixed(1)}
          <input
            type="range"
            id="volume"
            value={getVolume}
            onChange={(event) => {
              setVolume(event.target.valueAsNumber);
            }}
            min="0.0"
            max="10"
            step="0.1"
          ></input>
        </div>
      </Accordion>
    </div>
  );
};
