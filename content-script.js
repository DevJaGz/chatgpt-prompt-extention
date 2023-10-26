/// <reference path="chrome.intellisense.js" />

let currentChatId = "";
const CONVERSATION_DATA_ATTR = "testid";
const CONVERSATION_MATCH_LABEL = "conversation-turn";

const conversationFilter = ($conversation) => {
  const value = $conversation.getAttribute(`data-${CONVERSATION_DATA_ATTR}`);
  return value?.includes(CONVERSATION_MATCH_LABEL);
};

const isConversationEven = (dataTestidValue) => {
  const regex = new RegExp(CONVERSATION_MATCH_LABEL + "-(\\d+)");
  const match = regex.exec(dataTestidValue);
  const number = Number(match ? match[1] : 0);
  return number % 2 === 0;
};

const myConversationFilter = ($conversation) => {
  const value = $conversation.getAttribute(`data-${CONVERSATION_DATA_ATTR}`);
  return value?.includes(CONVERSATION_MATCH_LABEL) && isConversationEven(value);
};

const getConversations = () => {
  const queryElements = document.querySelectorAll(
    `[data-${CONVERSATION_DATA_ATTR}]`
  );
  if (!queryElements?.length) {
    return [];
  }
  return Array.from(queryElements).filter(myConversationFilter);
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

const createButtonClickHandler = () => {};

const createButton = (label, clickHandler = () => {}) => {
  const $button = document.createElement("button");
  $button.innerText = label;
  $button.addEventListener("click", clickHandler);
  $button.style.float = "right";
  $button.style.padding = "0.5rem";
  $button.style.borderRadius = "0.25rem";
  $button.style.background = "#19C37D";
  $button.style.margin = "1rem";
  return $button;
};

const drawButton = ($conversation) => {
  const $button = createButton("Add template", () => {
    console.log("click");
  });
  $conversation.appendChild($button);
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
  conversations.forEach(drawButton);
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
