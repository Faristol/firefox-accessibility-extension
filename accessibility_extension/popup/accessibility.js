document.addEventListener("DOMContentLoaded", () => {
  initializeEvents();
});

function initializeEvents() {
  browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      const tabId = tabs[0].id;
      document.querySelector("#small").addEventListener("click", () => {
        browser.tabs.sendMessage(tabId, { fontsize: "small" });
      });


      document.querySelector("#medium").addEventListener("click", () => {
        browser.tabs.sendMessage(tabId, { fontsize: "medium" });
      });

      document.querySelector("#large").addEventListener("click", () => {
        browser.tabs.sendMessage(tabId, { fontsize: "large" });
      });

      document.querySelector("#x-large").addEventListener("click", () => {
        browser.tabs.sendMessage(tabId, { fontsize: "x-large" });
      });

      document
        .querySelector("#xx-large")
        .addEventListener("click", () => {
          browser.tabs.sendMessage(tabId, { fontsize: "xx-large" });
        });

      document
        .querySelector("#xxx-large")
        .addEventListener("click", () => {
          browser.tabs.sendMessage(tabId, { fontsize: "xxx-large" });
        });

      document
        .querySelector("#reset-size")
        .addEventListener("click", () => {
          browser.tabs.sendMessage(tabId, { fontsize: "reset" });
        });
        //listeners per a el preview

      document
        .querySelector("#contrast")
        .addEventListener("click", () => {
          browser.tabs.sendMessage(tabId, { contrast: "contrast" });
        });

      document
        .querySelector("#reset-contrast")
        .addEventListener("click", () => {
          browser.tabs.sendMessage(tabId, { contrast: "reset" });
        });
      document.querySelector("#bold").addEventListener("click", () => {
        browser.tabs.sendMessage(tabId, { bold: "bold" });
      });
      document
        .querySelector("#reset-bold")
        .addEventListener("click", () => {
          browser.tabs.sendMessage(tabId, { bold: "reset" });
        });
      
      document.querySelector("#button-play").addEventListener("click", () => {
        browser.tabs.sendMessage(tabId, { action: "play" });
      });
      document.querySelector("#button-pause").addEventListener("click", () => {
        browser.tabs.sendMessage(tabId, { action: "pause" });
      });
      document.querySelector("#button-stop").addEventListener("click", () => {
        browser.tabs.sendMessage(tabId, { action: "stop" });
      });

    })
    .catch((error) => {
      console.error("Error fetching tab ID:", error);
    });
}
