# Contextify

**An AI-powered browser extension for understanding text while browsing.**

Contextify helps users understand unfamiliar text directly on a webpage. Select any text, click **Explain**, and Contextify provides an explanation in a floating popup without requiring you to leave the current page.

## ✨ Features

* **Text Selection** — Select any text on a webpage.
* **One-Click Explanation** — Click the **Explain** button to get an AI-generated explanation.
* **Page Context** — Uses surrounding webpage content along with the selected text to provide more relevant explanations.
* **Interactive Chat** — Continue asking follow-up questions about the selected content.
* **Conversation History** — Maintains previous messages to provide context for follow-up questions.
* **Floating Interface** — View explanations directly on the webpage without opening another tab.
* **Simple & Lightweight** — Designed to make understanding content quick and convenient.

## 🧠 How It Works

```text
Select text on a webpage
          ↓
Click "Explain"
          ↓
Contextify collects:
  • Selected text
  • Surrounding page context
  • Conversation history
          ↓
AI generates an explanation
          ↓
Explanation appears in the Contextify popup
```

## 🖥️ Extension Interface

Contextify provides a floating interface over the current webpage:

```text
┌──────────────────────────────────┐
│ Contextify                    ×  │
├──────────────────────────────────┤
│                                  │
│  Bot: Here's what this means...  │
│                                  │
│  User: Can you give an example?  │
│                                  │
│  Bot: Sure, here's an example... │
│                                  │
├──────────────────────────────────┤
│ Ask a follow-up...            ➤  │
└──────────────────────────────────┘
```

## 🚀 Installation

### 1. Download the Extension

Clone the repository:

```bash
git clone <repository-url>
```

Or download the repository as a ZIP file and extract it.

### 2. Open Browser Extensions

For Chromium-based browsers such as Chrome or Edge:

```text
chrome://extensions/
```

Open the extensions page in your browser.

### 3. Enable Developer Mode

Turn on **Developer mode** from the top-right corner of the extensions page.

### 4. Load Contextify

Click:

```text
Load unpacked
```

Select the **Contextify extension folder**.

The extension should now appear in your installed extensions.

### 5. Start Using Contextify

1. Open any webpage.
2. Select a piece of text.
3. Click the **Explain** button.
4. Contextify opens the explanation popup.
5. Ask follow-up questions if needed.

## 💡 Example

Suppose you're reading a technical article and come across:

```text
Transformer models use self-attention mechanisms.
```

Select the sentence and click **Explain**.

Contextify can consider:

```text
Selected Text
      +
Surrounding Page Context
      +
Previous Conversation
```

and provide an explanation relevant to the content you're reading.

You can then continue with questions such as:

```text
Why is self-attention useful?

Can you give me a simple example?

How is this different from RNNs?
```

## 🔄 Conversation Context

Contextify maintains the conversation while you're asking questions.

For example:

```text
User:
Explain this concept.

Bot:
This concept means...

User:
Can you give me an example?

Bot:
Sure. For example...

User:
Why is this useful?

Bot:
It is useful because...
```

This allows users to have a natural conversation instead of repeatedly providing the original context.

## 🛠️ Tech Stack

* JavaScript
* HTML
* CSS
* Browser Extension APIs
* AI / LLM APIs

## 📂 Project Structure

```text
Contextify/
│
├── manifest.json
├── content.js
├── popup.js
├── styles.css
├── icons/
└── ...
```

## 🎯 Motivation

While reading articles, documentation, research papers, or tutorials, users frequently encounter unfamiliar terms or concepts.

Normally, understanding them requires switching to another tab, copying the text, and providing additional context to an AI assistant.

**Contextify brings the explanation directly into the reading experience.**

Select → Explain → Understand.

## 👨‍💻 Author

**Nikhil Patidar**

MCA — NIT Raipur

---

⭐ If you find Contextify useful, consider giving the project a star!
