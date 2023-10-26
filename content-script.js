/// <reference path="chrome.intellisense.js" />

let currentChatId = "";

const conversationFilter = ($conversation) => {
  const dataTestIdValue = $conversation.getAttribute("data-testid");
  return dataTestIdValue?.includes("conversation-turn");
};

const getConversations = () => {
  const queryElements = document.querySelectorAll("[data-testid]");
  if (!queryElements?.length) {
    return [];
  }
  return Array.from(queryElements).filter(conversationFilter);
};

const getConversations$ = (timeout = 10_000) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const conversations = getConversations();
      if (!conversations?.length) {
        return;
      }
      clearInterval(interval);
      resolve(conversations);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      resolve(null);
    }, timeout);
  });
};

const newChatHandler = async () => {
  if (!currentChatId) {
    throw new Error("No chat ID");
  }
  const conversations = await getConversations$();
  if (conversations === null) {
    console.error("Could not find conversations");
    return;
  }
  console.log("[CONTENT SCRIPT] newChatIdHandler", conversations?.length);
};

function messageListener(message, sender, sendResponse) {
  const { type, chatId } = message;
  console.log("[CONTENT SCRIPT] message", message);

  if (type === "CHAT_SELECTED") {
    currentChatId = chatId;
    newChatHandler();
  }
}

(() => {
  chrome.runtime.onMessage.addListener(messageListener);
})();
