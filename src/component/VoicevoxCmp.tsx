import { useEffect, useState, type FC } from "react";
import { Accordion } from "./Accordion";
import "./modal.css";
import { fetchAudioQuery, fetchSynthesis, getMainText } from "./util";

interface voicevoxCmpType {}

const SPEAKER_ID = 1; // 四国めたん（例）

export const VoicevoxCmp: FC<voicevoxCmpType> = (props) => {
  const [textDoms, setTextDoms] = useState<HTMLParagraphElement[]>([]);
  const [loading, setLoading] = useState(false);

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
          SPEAKER_ID
        );
        if (!queryRes) return;

        const audioQuery = await queryRes.json();
        const synthRes = await fetchSynthesis(audioQuery, SPEAKER_ID);

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

  return (
    <>
      <div>
        <strong>voicevoxCmpType</strong>
      </div>
      <button onClick={handleClick}>取得し再生</button>

      <button onClick={playVoice} disabled={loading}>
        {loading ? "生成中…" : "再生"}
      </button>
      <Accordion>
        <div>test</div>
      </Accordion>
    </>
  );
};
