import { type FC, useEffect, useRef, useState } from "react";
import { Accordion } from "./Accordion";
import { Slider } from "./Slider";
import { getMainText } from "./util";

const SCALE = 20;

export const WebSpeechAPI: FC = () => {
  const [getPitch, setPitch] = useState<number>(20);
  const [getSpeed, setSpeed] = useState<number>(20);
  const [getVolume, setVolume] = useState<number>(10);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const stateRef = useRef({
    isPlaying: false,
    currentIndex: 0,
    textDoms: [] as HTMLParagraphElement[],
  });

  const voicesReadyRef = useRef(false);

  // ---------------------------
  // Voice 初期化（timeout付き）
  // ---------------------------
  const waitForVoices = () => {
    return new Promise<void>((resolve) => {
      let resolved = false;

      const tryGetVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          voicesReadyRef.current = true;
          resolved = true;
          resolve();
          return true;
        }
        return false;
      };

      if (tryGetVoices()) return;

      speechSynthesis.onvoiceschanged = () => {
        if (!resolved) {
          tryGetVoices();
        }
      };

      // timeout 保険
      setTimeout(() => {
        if (!resolved) {
          console.warn("voices load timeout, continue");
          resolve();
        }
      }, 2000);
    });
  };

  // ---------------------------
  // エンジン起動用ダミー発話
  // ---------------------------
  const initSpeechEngine = () => {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    speechSynthesis.speak(u);
  };

  // ---------------------------
  // 日本語 voice を取得
  // ---------------------------
  const getJapaneseVoice = () => {
    const voices = speechSynthesis.getVoices();
    return voices.find((v) => v.lang === "ja-JP") || voices[0] || null;
  };

  // ---------------------------
  // 長文分割
  // ---------------------------
  const splitText = (text: string, maxLength = 80): string[] => {
    const result: string[] = [];
    let current = "";

    for (const char of text) {
      current += char;
      if (current.length >= maxLength && /[。！？]/.test(char)) {
        result.push(current);
        current = "";
      }
    }
    if (current) result.push(current);
    return result;
  };

  // ---------------------------
  // stop
  // ---------------------------
  const stop = () => {
    stateRef.current.isPlaying = false;
    speechSynthesis.cancel();
    setIsPlaying(false);

    stateRef.current.textDoms.forEach((dom) =>
      dom.classList.remove("highlight"),
    );
  };

  // ---------------------------
  // クリック
  // ---------------------------
  const handleClick = async () => {
    initSpeechEngine();
    await waitForVoices();

    const textArr = getMainText();
    if (!textArr.length) return;

    stop();

    stateRef.current.textDoms = textArr;
    stateRef.current.currentIndex = 0;
    stateRef.current.isPlaying = true;
    setIsPlaying(true);

    runLoop();
  };

  // ---------------------------
  // メインループ
  // ---------------------------
  const runLoop = async () => {
    while (
      stateRef.current.isPlaying &&
      stateRef.current.currentIndex < stateRef.current.textDoms.length
    ) {
      const index = stateRef.current.currentIndex;
      const targetDom = stateRef.current.textDoms[index];
      const text = targetDom.textContent?.trim() || "";

      if (!text) {
        stateRef.current.currentIndex++;
        continue;
      }

      // highlight
      stateRef.current.textDoms.forEach((dom) =>
        dom.classList.remove("highlight"),
      );
      targetDom.classList.add("highlight");
      targetDom.scrollIntoView({ behavior: "smooth", block: "center" });

      let retry = 0;

      while (retry < 2) {
        try {
          await speakText(text);
          break;
        } catch (e) {
          console.warn("speech retry", e);
          retry++;
          await new Promise((r) => setTimeout(r, 500));
        }
      }

      stateRef.current.currentIndex++;
      await new Promise((r) => setTimeout(r, 200));
    }

    stop();
  };

  // ---------------------------
  // 安定版 speakText
  // ---------------------------
  const speakText = async (text: string) => {
    const voice = getJapaneseVoice();
    const chunks = splitText(text);

    for (const chunk of chunks) {
      if (!stateRef.current.isPlaying) break;

      await new Promise<void>((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.lang = "ja-JP";
        utterance.voice = voice;
        utterance.rate = getSpeed / SCALE;
        utterance.pitch = getPitch / SCALE;
        utterance.volume = getVolume / SCALE;

        utterance.onend = () => resolve();
        utterance.onerror = (e) => reject(e);
        console.log(chunk);
        speechSynthesis.speak(utterance);
      });
    }
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div>
      <div
        className="button-group"
        style={{ display: "flex", gap: "8px", marginBottom: "10px" }}
      >
        {isPlaying ? (
          <button className="btn-secondary" onClick={stop}>
            ■ 停止
          </button>
        ) : (
          <button className="btn-execute" onClick={handleClick}>
            ▶ 取得して再生
          </button>
        )}
      </div>

      <Accordion>
        <div style={{ paddingTop: "10px" }}>
          <Slider
            min="0"
            max="100"
            step={1}
            value={getPitch}
            setValue={setPitch}
            label="Pitch"
          />
          <Slider
            min="0"
            max="100"
            step={1}
            value={getSpeed}
            setValue={setSpeed}
            label="Speed"
          />
          <Slider
            min="0"
            max="100"
            step={1}
            value={getVolume}
            setValue={setVolume}
            label="Vol"
          />
        </div>
      </Accordion>
    </div>
  );
};
