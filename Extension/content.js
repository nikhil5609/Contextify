let explainButton = null;
let chatPopup = null;
let popupUI = `
    <div class="contextify-header">
      <span>Contextify</span>
      <button class="contextify-close-btn">&times;</button>
    </div>
    <div class="contextify-chat-messages"></div>
    <div class="contextify-chat-input-row">
      <input type="text" class="contextify-chat-input" placeholder="Ask a follow-up..." />
      <button class="contextify-chat-send-btn">Send</button>
    </div>
  `
let messages = [];

function removeExplainButton() {
  if (explainButton) {
    explainButton.remove();
    explainButton = null;
  }
}

function createExplainButton(selectionText, rect) {
  removeExplainButton();

  explainButton = document.createElement("button");
  explainButton.id = "contextify-explain-btn";
  explainButton.textContent = "Explain";

  const top = rect.top + window.scrollY - 40;
  const left = rect.left + window.scrollX + rect.width / 2;

  explainButton.style.top = `${top}px`;
  explainButton.style.left = `${left}px`;

  // Prevent the button click from clearing the selection before we read it
  explainButton.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

  explainButton.addEventListener("click", (e) => {
    e.stopPropagation();
    openChatPopup(selectionText, rect);
    removeExplainButton();
  });

  document.body.appendChild(explainButton);
}


function makeDraggable(popupEl, handleEl) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  handleEl.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("contextify-close-btn")) return;

    isDragging = true;

    const rect = popupEl.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    handleEl.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const newLeft = e.clientX - offsetX + window.scrollX;
    const newTop = e.clientY - offsetY + window.scrollY;

    popupEl.style.left = `${newLeft}px`;
    popupEl.style.top = `${newTop}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      handleEl.style.cursor = "grab";
    }
  });
}


function removeChatPopup() {
  if (chatPopup) {
    chatPopup.remove();
    chatPopup = null;
    messages = [];
  }
}

function appendMessage(role, text) {
  const messagesEl = chatPopup.querySelector(".contextify-chat-messages");

  if (role === "user" || role === "bot") {
    messages.push(role + ": " + text);
  }

  const msgEl = document.createElement("div");
  msgEl.className = `contextify-msg contextify-msg-${role}`;

  if (role === "bot") {
    // Basic markdown formatting
    let formattedText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");

    msgEl.innerHTML = formattedText;
  } else {
    msgEl.textContent = text;
  }

  messagesEl.appendChild(msgEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  return msgEl;
}

function openChatPopup(selectedText, rect) {
  removeChatPopup();

  chatPopup = document.createElement("div");
  chatPopup.id = "contextify-chat-popup";

  const top = rect.bottom + window.scrollY + 8;
  const left = rect.left + window.scrollX;
  chatPopup.style.top = `${top}px`;
  chatPopup.style.left = `${left}px`;

  chatPopup.innerHTML = popupUI;

  document.body.appendChild(chatPopup);
  chatPopup.querySelector(".contextify-close-btn").addEventListener("click", removeChatPopup);
  makeDraggable(chatPopup, chatPopup.querySelector(".contextify-header"));
  appendMessage("user", selectedText);
  sendMessageToBackend(selectedText)

  const inputEl = chatPopup.querySelector(".contextify-chat-input");
  const sendBtn = chatPopup.querySelector(".contextify-chat-send-btn");

  function sendFollowUp() {
    const value = inputEl.value.trim();
    if (!value) return;
    appendMessage("user", value);
    inputEl.value = "";
    sendMessageToBackend(value)
  }

  sendBtn.addEventListener("click", sendFollowUp);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendFollowUp();
  });

  chatPopup.addEventListener("mousedown", (e) => e.stopPropagation());
}


function handleSelectionChange() {
  const selection = window.getSelection();
  const selectedText = selection ? selection.toString().trim() : "";

  if (!selectedText) {
    removeExplainButton();
    return;
  }


  if (messages.length == 0) {
    let node = selection.anchorNode;

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    const container = node.closest("p, li, article, section, div");

    const surroundingText = container
      ? container.innerText.trim()
      : "";
    messages.push("Reference Text: " + surroundingText)
  }

  if (
    selection.anchorNode &&
    ((explainButton && explainButton.contains(selection.anchorNode)) ||
      (chatPopup && chatPopup.contains(selection.anchorNode)))
  ) {
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    removeExplainButton();
    return;
  }

  createExplainButton(selectedText, rect);
}

let debounceTimer = null;
document.addEventListener("selectionchange", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(handleSelectionChange, 150);
});


document.addEventListener("mousedown", (e) => {
  if (explainButton && e.target !== explainButton) {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === "") {
      removeExplainButton();
    }
  }

  if (chatPopup && !chatPopup.contains(e.target) && e.target !== explainButton) {
    removeChatPopup();
  }
});

window.addEventListener("scroll", () => {
  removeExplainButton();
}, true);


function sendMessageToBackend(selectedText) {
  const loadingEl = appendMessage("loading", "Thinking...");
  chrome.runtime.sendMessage(
    { type: "EXPLAIN_TEXT", text: messages },
    (response) => {
      console.log(response);
      loadingEl.remove();

      if (chrome.runtime.lastError) {
        appendMessage("bot", "Something went wrong. Please try again.");
        return;
      }

      if (response.status === "success") {
        appendMessage("bot", response.explanation);
      } else {
        appendMessage("bot", response.message || "Could not get an explanation.");
      }
    }
  );
}