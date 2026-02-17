import { useEffect, useState, type FC } from "react";
import { Accordion } from "./Accordion";
import "./modal.css";
import type { Speaker } from "./types";
import { fetchAudioQuery, fetchSynthesis, getMainText } from "./util";

interface voicevoxCmpType {}

export const VoicevoxCmp: FC<voicevoxCmpType> = (props) => {
  const [textDoms, setTextDoms] = useState<HTMLParagraphElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [speakerId, setSpeakerId] = useState<number>(3);
  const [speakerList, setSpeakerList] = useState<Speaker[]>([]);
  const [selectChar, setSelectChar] = useState<string>("");

  const handleClick = () => {
    const textArr = getMainText();
    setTextDoms(textArr);
  };
  type AsyncThunk = () => Promise<void | AsyncThunk>;
  // トランポリン関数（関数を繰り返し呼び出す）
  async function trampoline(fn: AsyncThunk): Promise<void> {
    console.log("start:trampoline");

    let current: void | AsyncThunk = fn;

    while (typeof current === "function") {
      current = await current();
    }
  }

  const playVoice = (index: number): AsyncThunk => {
    return async () => {
      setLoading(true);
      try {
        const queryRes = await fetchAudioQuery(
          textDoms[index]?.textContent,
          speakerId,
        );
        if (!queryRes) return;

        const audioQuery = await queryRes.json();
        const synthRes = await fetchSynthesis(audioQuery, speakerId);

        const arrayBuffer = await synthRes.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(blob);

        const audio = new Audio(audioUrl);
        audio.play();
        await audio.play(); // 再生完了待ち（重要）

        return playVoice(index + 1);
      } catch (e) {
        console.error(e);
        return;
      } finally {
        setLoading(false);
      }
    };
  };

  useEffect(() => {
    if (textDoms.length) {
      console.log("start:useEffect");
      trampoline(playVoice(0));
    }
  }, [textDoms]);

  // コンポーネント読み込み時にスピーカー一覧を取得
  useEffect(() => {
    // fetchSpeakers().then((data) => {
    //   setSpeakerList(data);
    // });

    setSpeakerList([
      {
        name: "四国めたん",
        speaker_uuid: "7df43e8a-b92a-44c5-ba90-6da93039988a",
        styles: [
          { name: "ノーマル", id: 2 },
          { name: "あまあま", id: 0 },
          { name: "ツンツン", id: 6 },
          { name: "セクシー", id: 4 },
          { name: "ささやき", id: 36 },
          { name: "ヒソヒソ", id: 37 },
        ],
        version: "0.14.4",
      },
      {
        name: "ずんだもん",
        speaker_uuid: "388f246b-aba8-4d01-9061-277a9c21645a",
        styles: [
          { name: "ノーマル", id: 3 },
          { name: "あまあま", id: 1 },
          { name: "ツンツン", id: 7 },
          { name: "セクシー", id: 5 },
          { name: "ささやき", id: 22 },
          { name: "ヒソヒソ", id: 38 },
        ],
        version: "0.14.4",
      },
    ]);
  }, []);

  // コンポーネント読み込み時にスピーカー一覧を取得
  useEffect(() => {
    if (speakerList.length > 0) {
      console.log(speakerList[0].speaker_uuid);
      setSelectChar(speakerList[0].speaker_uuid);
    }
  }, [speakerList]);

  return (
    <>
      <button className="btn-execute" onClick={handleClick}>
        ▶ 取得して再生
      </button>

      <button
        className="btn-secondary"
        onClick={playVoice(0)}
        disabled={loading}
      >
        {loading ? "生成中…" : "再生"}
      </button>
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
              .map((speaker) => (
                <>
                  {speaker.styles.map((style) => (
                    <option
                      key={speaker.speaker_uuid + style.id}
                      value={style.id}
                    >
                      {style.name}
                    </option>
                  ))}
                </>
              ))}
          </select>
        </div>
      </Accordion>
    </>
  );
};
