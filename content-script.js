(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`
    console.log("[CONTENT SCRIPT] message", message);
  });
})();