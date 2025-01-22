let blockedStrings;
let blockEndTime = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startBlocking") {
    blockedStrings = message.strings;
    blockEndTime = Date.now() + message.duration * 60 * 1000; // Convert minutes to milliseconds

    // Save the data to storage for persistence
    chrome.storage.local.set({ blockedStrings, blockEndTime });

    sendResponse({ success: true });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (Date.now() > blockEndTime) {
      blockedStrings = [];
      chrome.storage.local.remove(["blockedStrings", "blockEndTime"]);
      return;
    }

    for (const str of blockedStrings) {
      if (details.url.includes(str)) {
        return { cancel: true };
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
