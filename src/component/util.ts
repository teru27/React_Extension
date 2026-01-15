export function getMainText(): HTMLParagraphElement[] {
  if (!document.getElementsByClassName("p-novel__text")) return [];

  const div = document.getElementsByClassName("p-novel__text")[0];
  const p_texts = div.querySelectorAll("p");
  const textArr: HTMLParagraphElement[] = [];
  for (let i = 0; i < p_texts.length; i++) {
    const textDom = p_texts[i];
    textArr.push(textDom);
  }
  return textArr;
}

type Speaker = {
  name: string;
  speaker_uuid: string;
  styles: {
    id: number;
    name: string;
  }[];
};

const VOICEVOX_URL = "http://127.0.0.1:50021";

export const fetchSpeakers = async (): Promise<Speaker[]> => {
  const res = await fetch(`${VOICEVOX_URL}/speakers`);
  return res.json();
};

export const fetchAudioQuery = async (
  text: string,
  SPEAKER_ID: number
): Promise<Response> => {
  const queryRes = await fetch(
    `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(
      text
    )}&speaker=${SPEAKER_ID}`,
    { method: "POST" }
  );

  return queryRes;
};

export const fetchSynthesis = async (
  audioQuery: any,
  SPEAKER_ID: number
): Promise<Response> => {
  const synthRes = await fetch(
    `${VOICEVOX_URL}/synthesis?speaker=${SPEAKER_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(audioQuery),
    }
  );

  return synthRes;
};
