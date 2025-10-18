// 拡張機能のアイコンをクリックしたときにウィンドウを開く
// chrome.action.onClicked.addListener(() => {
//   chrome.windows.create({
//     url: "popup.html", // 表示したいHTMLファイル
//     type: "popup",
//     width: 400,
//     height: 600,
//   });
// });

//今表示しているサイトに追加する
// chrome.action.onClicked.addListener((tab) => {
//   if (!tab.id) return;

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id! },
//     files: ["content/contentScript.js"],
//   });
// });

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  chrome.tabs.sendMessage(tab.id, { type: "SHOW_MODAL" });
});