import ReactDOM from "react-dom/client";
import ModalView from "../popup/ModalView";

// 拡張機能ボタンを押下した際にモーダルを追加する
if (!document.getElementById("my-extension-modal-root")) {
    const container = document.createElement("div");
    container.id = "react-extension-modal-root";
    const shadow = container.attachShadow({ mode: "open" });
    document.body.appendChild(container);

    // CSS を Shadow DOM に注入
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = chrome.runtime.getURL("assets/modal.css");
    shadow.appendChild(styleLink);

    // React をマウント
    const mountPoint = document.createElement("div");
    shadow.appendChild(mountPoint);
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<ModalView />);
}