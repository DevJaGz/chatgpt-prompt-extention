/// <reference path="./chrome.intellisense.js" />

let currentChatId = "";

const conversatsMatcher = {
  dataAttr: "testid",
  dataValue: "conversation-turn",
};

const userPromptMatcher = {
  attr: '[class=""]',
};

const CONVERSATION_BUTTON_LABEL = "Save as template";

const conversationFilter = ($conversation) => {
  const value = $conversation.getAttribute(
    `data-${conversatsMatcher.dataAttr}`
  );
  return value?.includes(conversatsMatcher.dataValue);
};

const isConversationEven = (dataTestidValue) => {
  const regex = new RegExp(conversatsMatcher.dataValue + "-(\\d+)");
  const match = regex.exec(dataTestidValue);
  const number = Number(match ? match[1] : 0);
  return number % 2 === 0;
};

const myConversationFilter = ($conversation) => {
  const value = $conversation.getAttribute(
    `data-${conversatsMatcher.dataAttr}`
  );
  return (
    value?.includes(conversatsMatcher.dataValue) && isConversationEven(value)
  );
};

const getConversations = () => {
  const queryElements = document.querySelectorAll(
    `[data-${conversatsMatcher.dataAttr}]`
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

const extractUserPrompt = ($conversation) => {
  return $conversation.querySelector(userPromptMatcher.attr)?.textContent;
};

const drawButton = ($conversation) => {
  const clickHandler = () => {
    const userPromt = extractUserPrompt($conversation);
    if (!userPromt) {
      console.error("Could not find user prompt");
      return;
    }
    console.log(
      `click: ${JSON.stringify(userPromt, null, 2)}, Chat Id: ${currentChatId}`
    );
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
  if (type === "NEW_CHAT_ID") {
    currentChatId = chatId;
    newChatHandler();
  }
}

(() => {
  chrome.runtime.onMessage.addListener(messageListener);
})();
