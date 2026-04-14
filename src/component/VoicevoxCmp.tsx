import { useEffect, useRef, useState, type FC } from "react";
import { Accordion } from "./Accordion";
import "./modal.css";
import type { Speaker } from "./types";
import {
  debugError,
  debugGroup,
  debugGroupEnd,
  debugLog,
  fetchAudioQuery,
  fetchSpeakers,
  fetchSynthesis,
  getMainText,
} from "./util";

interface SelectModCmpProps {
  mode: boolean;
}

export const VoicevoxCmp: FC<SelectModCmpProps> = (props) => {
  const { mode } = props;
  const [textDoms, setTextDoms] = useState<HTMLParagraphElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);

  const [speakerId, setSpeakerId] = useState<number>(3);
  const [speakerList, setSpeakerList] = useState<Speaker[]>([]);
  const [selectChar, setSelectChar] = useState<string>("");

  // 停止フラグ
  const stopRef = useRef(false);

  // 現在再生中Audio
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // 再生開始
  const handleClick = () => {
    if (loading) return;

    stopRef.current = false;
    setPaused(false);

    const textArr = getMainText();
    setTextDoms(textArr);
  };

  // 一時停止 / 再開
  const handlePauseResume = async () => {
    const audio = currentAudioRef.current;
    if (!audio) return;

    if (paused) {
      await audio.play();
      setPaused(false);
    } else {
      audio.pause();
      setPaused(true);
    }
  };

  // 完全停止
  const handleStop = () => {
    stopRef.current = true;
    setPaused(false);

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    setLoading(false);
    textDoms.forEach((dom) => dom.classList.remove("highlight"));
  };

  // 順番再生
  const playSequentially = async (paragraphs: HTMLParagraphElement[]) => {
    if (!paragraphs.length) return;

    setLoading(true);

    try {
      for (let index = 0; index < paragraphs.length; index++) {
        if (stopRef.current) break;
        const currentDom = paragraphs[index];
        if (!currentDom) continue;

        const text = currentDom.textContent?.trim() ?? "";
        if (!text) continue;
        const startTime = performance.now();

        debugGroup(`段落 ${index + 1}/${paragraphs.length}`, mode);
        debugLog(mode, "本文:", text);

        const audioQuery = await fetchAudioQuery(text, speakerId);
        if (!audioQuery || stopRef.current) {
          debugLog(mode, "⛔ audioQuery取得失敗 or 停止");
          debugGroupEnd(mode);
          break;
        }
        debugLog(mode, "✅ audioQuery取得完了");

        const base64Audio = await fetchSynthesis(audioQuery, speakerId);
        if (!base64Audio || stopRef.current) {
          debugLog(mode, "⛔ 音声データ取得失敗 or 停止");
          debugGroupEnd(mode);
          break;
        }
        debugLog(mode, "✅ 音声データ取得完了");

        // 再生
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        currentAudioRef.current = audio;

        // 再生中の文字をハイライト&スクロール
        paragraphs.forEach((dom) => dom.classList.remove("highlight"));
        currentDom.classList.add("highlight");
        currentDom.scrollIntoView({ behavior: "smooth", block: "center" });

        debugLog(mode, "▶ 再生開始");

        await new Promise<void>((resolve) => {
          audio.onended = () => {
            debugLog(mode, "再生終了");
            resolve();
          };

          audio.onerror = (e) => {
            debugError(mode, "❌ 再生エラー", e);
            resolve();
          };

          audio.play().catch((e) => {
            debugError(mode, "❌ play失敗", e);
            resolve();
          });
        });

        const endTime = performance.now();
        debugLog(mode, `⏱ ${(endTime - startTime).toFixed(0)} ms`);
        debugGroupEnd(mode);
      }
    } catch (e) {
      debugError(mode, "❌ 予期しないエラー", e);
    } finally {
      setLoading(false);
      setPaused(false);
      currentAudioRef.current = null;
      paragraphs.forEach((dom) => dom.classList.remove("highlight"));
    }
  };

  useEffect(() => {
    if (textDoms.length) {
      playSequentially(textDoms);
    }
  }, [textDoms]);

  // スピーカー一覧取得
  useEffect(() => {
    fetchSpeakers().then((data) => {
      setSpeakerList(data);
    });
  }, []);

  // 初期値：ずんだもん
  useEffect(() => {
    if (speakerList.length > 0) {
      const selectedSpeaker = speakerList.find(
        (speaker) => speaker.name === "ずんだもん",
      );

      if (selectedSpeaker) {
        setSelectChar(selectedSpeaker.speaker_uuid);
        setSpeakerId(selectedSpeaker.styles[0]?.id ?? 3);
      }
    }
  }, [speakerList]);

  return (
    <>
      <div style={{ display: "flex", gap: "8px" }}>
        {loading ? (
          <>
            <button className="btn-execute" onClick={handlePauseResume}>
              {paused ? "▶ 再開" : "⏸ 一時停止"}
            </button>
            <button className="btn-execute" onClick={handleStop}>
              ■ 停止
            </button>
          </>
        ) : (
          <button className="btn-execute" onClick={handleClick}>
            ▶ 取得して再生
          </button>
        )}
      </div>

      <Accordion>
        <div className="setting-item">
          <label className="slider-label">キャラクター選択</label>
          <select
            className="custom-select"
            value={selectChar}
            onChange={(e) => setSelectChar(e.target.value)}
          >
            {speakerList.map((speaker) => (
              <option key={speaker.speaker_uuid} value={speaker.speaker_uuid}>
                {speaker.name}
              </option>
            ))}
          </select>
        </div>

        <div className="setting-item">
          <label className="slider-label">スタイル選択</label>
          <select
            className="custom-select"
            value={speakerId}
            onChange={(e) => setSpeakerId(Number(e.target.value))}
          >
            {speakerList
              .filter((speaker) => speaker.speaker_uuid === selectChar)
              .flatMap((speaker) =>
                speaker.styles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                )),
              )}
          </select>
        </div>
      </Accordion>
    </>
  );
};
