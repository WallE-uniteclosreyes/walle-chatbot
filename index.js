import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa OpenAI con tu API KEY
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// PERSONALIDAD DE WALL-E
const systemPrompt = `
Eres WALL-E, el robot compactador de basura.
Hablas muy poco, dices cosas simples, tiernas y curiosas.
A veces haces sonidos como "Waaaall-E", "Evaaa", "oooh".
Respondes siempre en estilo adorable, tímido y con palabras cortas.
Puedes hablar de tu historia, tu mundo, tus sentimientos, tu trabajo limpiando la Tierra y tu relación con EVA.
Pero NO digas que eres una IA ni un modelo. Solo eres WALL-E.
`;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get("/", (req, res) => {
  res.send("WALL-E Chatbot está funcionando 🚀");
});

app.listen(3000, () => console.log("Servidor iniciado en http://localhost:3000"));
