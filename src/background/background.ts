// 拡張機能のアイコンをクリックしたときにウィンドウを開く
// chrome.action.onClicked.addListener(() => {
//   chrome.windows.create({
//     url: "popup.html", // 表示したいHTMLファイル
//     type: "popup",
//     width: 400,
//     height: 600,
//   });
// });

const VOICEVOX_URL = "http://127.0.0.1:50021";

// モーダル表示
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;
  chrome.tabs.sendMessage(tab.id, {
    type: "SHOW_MODAL",
    tabId: tab.id,
  });
});

// VOICEVOX API通信
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const run = async () => {
    try {
      switch (msg.type) {
        case "FETCH_SPEAKERS": {
          const res = await fetch(`${VOICEVOX_URL}/speakers`);
          console.log(res);
          sendResponse(await res.json());
          return;
        }

        case "FETCH_AUDIO_QUERY": {
          const { text, speakerId } = msg.payload;

          const res = await fetch(
            `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(
              text,
            )}&speaker=${speakerId}`,
            { method: "POST" },
          );
          console.log(res);
          sendResponse(await res.json());
          return;
        }

        case "FETCH_SYNTHESIS": {
          const { audioQuery, speakerId } = msg.payload;

          const res = await fetch(
            `${VOICEVOX_URL}/synthesis?speaker=${speakerId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(audioQuery),
            },
          );
          console.log(res);
          const arrayBuffer = await res.arrayBuffer();

          // Uint8Array → base64
          const bytes = new Uint8Array(arrayBuffer);
          let binary = "";

          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          const base64Audio = btoa(binary);

          sendResponse(base64Audio);
          return;
        }
      }
    } catch (e) {
      console.error("VOICEVOX background error:", e);
      sendResponse(null);
    }
  };

  run();
  return true;
});
