/// <reference path="chrome.intellisense.js" />

let currentChatId = "";

function newChatHandler() {
  if (!currentChatId) {
    throw new Error("No chat ID");
  }
  console.log("[CONTENT SCRIPT] newChatIdHandler", currentChatId);
}

function getMessages(message, sender, sendResponse) {
  const { type, chatId } = message;
  console.log("[CONTENT SCRIPT] message", message);

  if (type === "CHAT_SELECTED") {
    currentChatId = chatId;
    newChatHandler();
  }
}

(() => {
  chrome.runtime.onMessage.addListener(getMessages);
})();
