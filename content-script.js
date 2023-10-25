 /// <reference path="chrome.intellisense.js" />

(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { type } = message;

    if (type === "NEW_CHAT_ID") {
      console.log("[CONTENT SCRIPT] message", message);
    }
  });

})();