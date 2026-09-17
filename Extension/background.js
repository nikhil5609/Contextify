console.log("Contextify background service worker loaded.");

const BACKEND_URL = "http://localhost:5000/api/explain";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "EXPLAIN_TEXT") {
    fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message.text }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          sendResponse({ status: "error", message: data.error });
        } else {
          sendResponse({ status: "success", explanation: data.explanation });
        }
      })
      .catch((err) => {
        console.error("Contextify: backend request failed", err);
        sendResponse({ status: "error", message: "Could not reach backend." });
      });
  }

  // Returning true keeps the message channel open for async sendResponse —
  // required here since fetch() resolves asynchronously.
  return true;
});