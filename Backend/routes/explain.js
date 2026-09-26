import express from "express";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const router = express.Router();

const model = new ChatGroq({
  model: "openai/gpt-oss-20b",
  temperature: 0.3,
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",`You are Contextify, an assistant that explains selected webpage text clearly and concisely.

The user may provide multiple pieces of text in the input. These pieces represent short-term memory (STM) from the user's previous selections on the webpage.

Instructions:

* Treat the most recent user text as the primary text that the user wants explained.
* Use previous selected text only as supporting context when it helps you understand the current text.
* Do not explain every previous text unless the user explicitly asks you to.
* If the current text refers to something mentioned in previous text, use that context to make the explanation clearer.
* Do not assume that previous text is part of the current text; it is only contextual information.
* Give a short, easy-to-understand explanation.
* If the current text is a technical term, define it simply.
* If it is a sentence, paragraph, or concept, explain its meaning in plain language.
* Avoid unnecessary details, repetition, and unrelated information.

The input contains the user's short-term memory and the latest selected text. Focus your response on explaining the latest selected text.

`,
  ],
  ["human", "Explain this user last text:\n\n{selectedText} and in response just answer the last question of user. Other previous text are for understanding for yours it is a Short term llm memory"],
]);

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    console.log(text);
    if (text?.length == 0 || typeof text == "undefined") {
      return res.status(400).json({ error: "Missing or invalid 'text' field." });
    }

    const prompt = await promptTemplate.formatMessages({ selectedText: text });
    const response = await model.invoke(prompt);
    console.log(response.content);
    
    res.json({ explanation: response.content });
  } catch (err) {
    console.error("Error in /api/explain:", err);
    res.status(500).json({ error: "Failed to generate explanation." });
  }
});

export default router;