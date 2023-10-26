/// <reference path="chrome.intellisense.js" />

function notifyTabMessage(tabId, message) {
  console.log("[BACKGROUND] message", message);
  chrome.tabs.sendMessage(tabId, message);
}

function getChatIdFromURL(tabId, tab) {
  // Get the URL of the tab
  const URL = tab.url;
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
      type: "CHAT_SELECTED",
      chatId,
    };

    // Send the message to the tab
    notifyTabMessage(tabId, message);
  }
}

function listenTabChanges(tabId, tab) {
  getChatIdFromURL(tabId, tab);
}

chrome.tabs.onUpdated.addListener(listenTabChanges);
