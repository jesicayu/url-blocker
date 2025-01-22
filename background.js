let blockedStrings;
let blockEndTime = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateRules") {
    const { stringsToBlock } = message;
    const rules = stringsToBlock.map((string, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: `*${string}*`,
        resourceTypes: ["main_frame"],
      },
    }));

    chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: rules.map((rule) => rule.id),
        addRules: rules,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else {
          console.log("Dynamic blocking rules updated successfully!");
        }
      }
    );

    sendResponse({ success: true });
  }
});
