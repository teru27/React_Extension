// 拡張機能のアイコンをクリックしたときにウィンドウを開く
// chrome.action.onClicked.addListener(() => {
//   chrome.windows.create({
//     url: "popup.html", // 表示したいHTMLファイル
//     type: "popup",
//     width: 400,
//     height: 600,
//   });
// });

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  chrome.tabs.sendMessage(tab.id, { type: "SHOW_MODAL", tabId: tab.id });
});