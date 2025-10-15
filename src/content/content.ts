function injectModal() {
  fetch(chrome.runtime.getURL("modal.html"))
    .then((res) => res.text())
    .then((html) => {
      const container = document.createElement("div");
      container.innerHTML = html;
      document.body.appendChild(container);
      console.log("test");
      const closeBtn = container.querySelector("#close-modal");
      closeBtn?.addEventListener("click", () => {
        container.remove();
      });
    });
}

injectModal();
