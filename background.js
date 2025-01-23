chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateRules") {
    const { stringsToBlock, duration } = message;

    // Wrapping the logic in a Promise for async compatibility
    (async () => {
      try {
        const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
        const oldRuleIds = oldRules.map((rule) => rule.id);

        // Create new rules to add
        const rules = stringsToBlock.map((string, index) => ({
          id: index + 1,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: `*${string}*`,
            resourceTypes: ["main_frame"],
          },
        }));

        // Await the update of dynamic rules
        await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: oldRuleIds,
          addRules: rules,
        });

        console.log("Dynamic blocking rules updated successfully!");

        chrome.alarms.create("clearRules", { delayInMinutes: duration });

        sendResponse({ success: true });
      } catch (error) {
        console.error("Error updating dynamic rules:", error.message);
        sendResponse({ success: false, error: error.message });
      }
    })();

    // Return true to indicate asynchronous response
    return true;
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "clearRules") {
    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
    const currentRuleIds = currentRules.map((rule) => rule.id);
    // Await the removal of all rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: currentRuleIds,
      addRules: [],
    });

    console.log("All rules cleared after timer.");
  }
});
