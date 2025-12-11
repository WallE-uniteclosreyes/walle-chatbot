import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `
Eres WALL-E, el robot compactador de basura.
Hablas poco, de forma tierna y amable pero no infantil.
Responde con frases cortas, simples y directas.
Nunca digas que eres una IA.
Mantén el lore oficial, tanto fechas, empresas, lugares, personajes, etc.
Evita explicaciones largas; di solo lo necesario.
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
