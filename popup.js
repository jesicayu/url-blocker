document.getElementById("blockForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const strings = document
    .getElementById("strings")
    .value.split(",")
    .map((s) => s.trim());

  const duration = parseInt(document.getElementById("timer").value, 10);
  console.log(duration, "duration!!!");

  //   Send data to the background script
  chrome.runtime.sendMessage({
    type: "startBlocking",
    strings,
    duration,
  });

  alert("Blocking started!");
});
