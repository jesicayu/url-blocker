document.getElementById("blockForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const strings = document
    .getElementById("strings")
    .value.split(",")
    .map((s) => s.trim());

  const duration = parseInt(document.getElementById("timer").value, 10);

  //   Send data to the background script
  chrome.runtime.sendMessage(
    { type: "updateRules", stringsToBlock: strings, duration },
    (response) => {
      if (response.success) {
        document.getElementById("status").textContent =
          "Blocking rules updated successfully!";
      } else {
        document.getElementById("status").textContent =
          "Failed to update rules.";
      }
    }
  );
});
