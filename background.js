chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateRules") {
    const { stringsToBlock } = message;

    // Wrapping the logic in a Promise for async compatibility
    (async () => {
      try {
        if (stringsToBlock.length === 0) {
          console.log("No strings to block, removing all rules.");

          const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
          const oldRuleIds = oldRules.map((rule) => rule.id);
          // Await the removal of all rules
          await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: oldRuleIds,
            addRules: [],
          });

          console.log("All rules removed!");
          dynamicRuleIds = []; // Clear the rules
          sendResponse({ success: true });
        } else {
          console.log("Updating blocking rules...");

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

          const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
          const oldRuleIds = oldRules.map((rule) => rule.id);

          // Await the update of dynamic rules
          await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: oldRuleIds,
            addRules: rules,
          });

          console.log("Dynamic blocking rules updated successfully!");
          sendResponse({ success: true });
        }
      } catch (error) {
        console.error("Error updating dynamic rules:", error.message);
        sendResponse({ success: false, error: error.message });
      }
    })();

    // Return true to indicate asynchronous response
    return true;
  }
});
