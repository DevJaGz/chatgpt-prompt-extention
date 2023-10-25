 /// <reference path="chrome.intellisense.js" />

function getChatId(tabId, tab) {
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


    const message = {
      type: "NEW",
      chatId,
    }

    notifyTabMessage(tabId, message);
  }
}

function notifyTabMessage(tabId, message){
  console.log("[BACKGROUND] message", message);
  chrome.tabs.sendMessage(tabId, message);
}

chrome.tabs.onUpdated.addListener(getChatId);
