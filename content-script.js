/// <reference path="chrome.intellisense.js" />

let currentChatId = "";

function newChatIdHandler() {
  if (!currentChatId) {
    throw new Error("No chat ID");
  }
  console.log("[CONTENT SCRIPT] newChatIdHandler", currentChatId);
}

function getMessages(message, sender, sendResponse) {
  const { type, chatId } = message;
  console.log("[CONTENT SCRIPT] message", message);

  if (type === "NEW_CHAT_ID") {
    currentChatId = chatId;
    newChatIdHandler();
  }
}

(() => {
  chrome.runtime.onMessage.addListener(getMessages);
})();
