import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key is missing from .env" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Format conversation history for OpenAI API
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

    // Add system message if needed (optional, can be customized)
    messages.push({
      role: "system",
      content:
        "You are a helpful and friendly AI assistant. Keep your responses concise and conversational.",
    });

    // Add conversation history
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: { sender: string; content: string }) => {
        if (msg.sender === "CLIENT") {
          messages.push({
            role: "user",
            content: msg.content,
          });
        } else if (msg.sender === "AVATAR") {
          messages.push({
            role: "assistant",
            content: msg.content,
          });
        }
      });
    }

    // Add current user message
    messages.push({
      role: "user",
      content: message,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "";

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

