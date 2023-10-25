chrome.tabs.onUpdated.addListener((tabId, tab) => {
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
    // Send a message to the content script with the chat ID
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      chatId,
    });
  }
});