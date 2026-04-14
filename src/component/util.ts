export function getMainText(): HTMLParagraphElement[] {
  if (!document.getElementsByClassName("p-novel__text")) return [];

  const div = document.getElementsByClassName("p-novel__text")[0];
  const p_texts = div.querySelectorAll("p");
  const textArr: HTMLParagraphElement[] = [];
  for (let i = 0; i < p_texts.length; i++) {
    const textDom = p_texts[i];
    // 空行はスキップ
    if (!textDom.textContent?.trim()) continue;

    textArr.push(textDom);
  }
  return textArr;
}

export const fetchSpeakers = async () => {
  return chrome.runtime.sendMessage({ type: "FETCH_SPEAKERS" });
};

export const fetchAudioQuery = async (text: string, speakerId: number) => {
  return chrome.runtime.sendMessage({
    type: "FETCH_AUDIO_QUERY",
    payload: { text, speakerId },
  });
};

export const fetchSynthesis = async (audioQuery: any, speakerId: number) => {
  return chrome.runtime.sendMessage({
    type: "FETCH_SYNTHESIS",
    payload: { audioQuery, speakerId },
  });
};

export const debugLog = (debugMode: boolean, ...args: any[]) => {
  if (!debugMode) return;
  console.log("[VOICEVOX]", ...args);
};

export const debugError = (debugMode: boolean, ...args: any[]) => {
  if (!debugMode) return;
  console.error("[VOICEVOX ERROR]", ...args);
};

export const debugGroup = (label: string, debugMode: boolean) => {
  if (!debugMode) return;
  console.group(label);
};

export const debugGroupEnd = (debugMode: boolean) => {
  if (!debugMode) return;
  console.groupEnd();
};
