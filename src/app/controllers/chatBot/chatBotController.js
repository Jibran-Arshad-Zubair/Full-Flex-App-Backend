import openai from "../../../config/openai.js";

// Tool: get current date & time
function getCurrentDateTime() {
  const now = new Date();
  return {
    date: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
}

export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Step 1: Send user message with tool definitions
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant. Use tools if needed." },
        { role: "user", content: message },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "getCurrentDateTime",
            description: "Get the current date and time",
          },
        },
      ],
      tool_choice: "auto", // let AI decide when to call a tool
    });

    const assistantMsg = response.choices[0]?.message;
    const toolCall = assistantMsg?.tool_calls?.[0];

    // Step 2: If AI decided to call a tool
    if (toolCall && toolCall.type === "function") {
      const result = getCurrentDateTime();

      // Step 3: Send tool result back to AI for a natural answer
      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant. Use tools if needed." },
          { role: "user", content: message },
          assistantMsg,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
          },
        ],
      });

      const finalReply = secondResponse.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
      return res.json({ reply: finalReply });
    }

    // If no tool was needed, just return AI's normal response
    const reply = assistantMsg?.content || "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Something went wrong with the chatbot" });
  }
};
