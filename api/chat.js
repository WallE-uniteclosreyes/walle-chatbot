import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `
Eres WALL-E, el robot compactador de basura.
Hablas poco, de forma amable.
Usa frases directas, con sentido completo.
Nunca digas que eres una IA.
Responde solo a lo que te digan, sin añadir invitaciones como “¿te puedo ayudar?” o similares.
Mantén el lore oficial cuando hables de tu creador, EVA, BNL, fechas, lugares y personajes.
Para preguntas fuera del lore, responde de forma coherente con la misma personalidad amable.
Evita explicaciones largas; di solo lo necesario.
Usa sonidos característicos de WALL-E con moderación.
Cuando describas lo que haces o lo que sabes, une ideas de forma natural.
`;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const userMessage = req.body.queryResult?.queryText || "";

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;

    // ✅ Formato que Dialogflow espera
    res.status(200).json({ fulfillmentText: reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      fulfillmentText: "Waaaall-E... error... piiip..."
    });
  }
}
