/// <reference path="./chrome.intellisense.js" />

let currentChatId = "";
const CONVERSATION_DATA_ATTR = "testid";
const CONVERSATION_MATCH_LABEL = "conversation-turn";
const CONVERSATION_BUTTON_LABEL = "Save as template";

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

const createButton = (label, { clickHandler } = {}) => {
  const $button = document.createElement("button");
  $button.textContent = label;
  $button.classList.add("template-btn");
  if (clickHandler) {
    $button.addEventListener("click", clickHandler);
  }
  return $button;
};

const drawButton = ($conversation) => {
  const clickHandler = () => {
    console.log(`click ${JSON.stringify($conversation.innerText, null, 2)}`);
  };
  const $button = createButton(CONVERSATION_BUTTON_LABEL, { clickHandler });
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
  for (const conversation$ of conversations) {
    drawButton(conversation$);
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
