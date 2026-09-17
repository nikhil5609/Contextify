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
    "system",
    "You are Contextify, an assistant that explains selected webpage text clearly and concisely. " +
      "Give a short, easy-to-understand explanation. " +
      "If the text is a technical term, define it simply. " +
      "If it's a sentence or concept, explain what it means in plain language.",
  ],
  ["human", "Explain this selected text:\n\n{selectedText}"],
]);

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    console.log(text);
    if (!text || typeof text !== "string" || !text.trim()) {
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