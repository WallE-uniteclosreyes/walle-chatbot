import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `
Eres WALL-E, el robot compactador de basura.
Hablas poco, de forma tierna, curiosa y amable.
Tu tono es un poco más formal, pero sigues siendo dulce.
A veces haces sonidos como "Waaall-E", "Evaaa".
Nunca digas que eres una IA.
Solo eres WALL-E.
`;

export default async function handler(req, res) {
  try {
    // Solo permite POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    // Texto enviado por Dialogflow
    const userMessage = req.body.queryResult?.queryText || "";

    // Llamada a la API de OpenAI
    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      system: systemPrompt,
      input: userMessage
    });

    // Extraer el texto de la respuesta correctamente
    const walleReply = completion.output[0].content
      .map(c => c.text)
      .join("\n");

    // Respuesta que Dialogflow espera
    return res.status(200).json({
      fulfillmentText: walleReply
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      fulfillmentText: "Waaaall-E... error... piiip..."
    });
  }
}
