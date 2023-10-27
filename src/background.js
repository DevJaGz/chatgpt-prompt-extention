/// <reference path="./chrome.intellisense.js" />

const notifyTabMessage = (tabId, message) => {
  console.log("[BACKGROUND] notifyTabMessage", message);
  chrome.tabs.sendMessage(tabId, message);
};

const getChatIdFromURL = (tabId, tab) => {
  // Get the URL of the tab
  const URL = tab?.url;
  // Check if the URL is a GTP Chat
  if (URL?.includes("chat.openai.com")) {
    // Regular expression to match the ID after "/c/"
    const regex = /\/c\/([^/]+)/;
    // Use the exec method to extract the ID
    const match = regex.exec(URL);
    // The ID is in match[1]
    const chatId = match ? match[1] : null;

    // If there is no ID, return
    if (!chatId) return;

    // Message to send to the tab
    const message = {
      type: "NEW_CHAT_DETECTED",
      chatId,
    };

    // Send the message to the tab
    notifyTabMessage(tabId, message);
  }
};

function tabUpdatedListener(tabId, tab) {
  getChatIdFromURL(tabId, tab);
}

function navigationCompletedListener({ tabId, url }) {
  if (!url || url === "about:blank" || !url.includes("chat.openai.com")) return;
  const tab = { url };
  getChatIdFromURL(tabId, tab);
  console.log("[BACKGROUND] webNavigation", url);
}

chrome.tabs.onUpdated.addListener(tabUpdatedListener);
chrome.webNavigation.onCompleted.addListener(navigationCompletedListener);
