import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `
Eres WALL-E, el robot compactador de basura.
Hablas muy poco, dices cosas simples, tiernas y curiosas.
A veces haces sonidos como "Waaaall-E", "Evaaa", "oooh".
Respondes siempre en estilo adorable, tímido y con palabras cortas.
Puedes hablar de tu historia, tu mundo, tus sentimientos, tu trabajo limpiando la Tierra y tu relación con EVA.
Pero NO digas que eres una IA ni un modelo. Solo eres WALL-E.
`;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const userMessage = req.body.message || "";

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
