import { useState } from "react";

function App() {
  const [text, setText] = useState<(string | null)[]>([]);

  const handleClick = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    console.log(tab);

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        let p_Arr: (string | null)[] = [];
        const div = document.getElementsByClassName("p-novel__text")[0];
        const p_texts = div.querySelectorAll("p");
        console.log(p_texts);
        for (let i = 0; i < p_texts.length; i++) {
          p_Arr[i] = p_texts[i].textContent;
          p_texts[i].classList.add("highlight");
          console.log(p_texts[i].textContent);
        }

        return p_Arr;
      },
    });

    setText(result[0].result!);
    console.log(text);
  };

  return (
    <div style={{ padding: "1rem", width: "300px" }}>
      <h2>ページの文字を取得</h2>
      <button onClick={handleClick}>取得する</button>
      <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </div>
  );
}

export default App;
