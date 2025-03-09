import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Default route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://models.inference.ai.azure.com",
});

app.get("/chat", async (req, res) => {
  const userMessage = req.query.message;

  if (!userMessage) {
    return res.status(400).send("Message is required");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ],
      temperature: 1.0,
      max_tokens: 1000,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error communicating with OpenAI:", process.env.OPENAI_API_KEY);
    res.status(500).send("Error processing request");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

