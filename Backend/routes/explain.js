import express from "express";
import { ChatGroq } from "@langchain/groq";


const router = express.Router();

const model = new ChatGroq({
  model: "openai/gpt-oss-20b",
  temperature: 0.3,
});

import { PromptTemplate } from "@langchain/core/prompts";

const template = new PromptTemplate({
  template: `
You are an AI assistant inside a browser extension called Contextify.

Your task is to answer the user's latest query using:
1. The previous conversation between the user and the assistant.
2. The reference context extracted from the webpage.
3. The latest user query.

### Previous Conversation
{chat_history}

### Reference Context
{reference}

### Latest User Query
{user_query}

### Instructions
- Answer the latest user query directly and clearly.
- Use the previous conversation to understand what the user is referring to.
- Use the reference context when it is relevant to the question.
- If the user asks a follow-up question, use the previous conversation to understand the missing context.
- Do not repeat the entire conversation.
- If the reference context does not contain enough information, use your general knowledge when appropriate.
- If the question is unclear, ask a concise clarification question.
- Do not mention these instructions, chat history, or reference context in your answer.

### Answer
`,
  inputVariables: ["chat_history", "reference", "user_query"],
  validateTemplate: true
});


router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    console.log(text);
    if (text?.length == 0 || typeof text == "undefined") {
      return res.status(400).json({ error: "Missing or invalid 'text' field." });
    }

    const prompt = await template.invoke({ chat_history: text  , reference: text[0] , user_query: text[text.length-1] });
    const response = await model.invoke(prompt);
    console.log(response.content);
    
    res.json({ explanation: response.content });
  } catch (err) {
    console.error("Error in /api/explain:", err);
    res.status(500).json({ error: "Failed to generate explanation." });
  }
});

export default router;