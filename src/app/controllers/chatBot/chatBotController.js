import openai from "../../../config/openai.js";


// function getSystemPrompt(role) {
//   if (role === "student") return "You are a helpful study assistant for students.";
//   if (role === "teacher") return "You are a helpful assistant for teachers, helping manage courses and students.";
//   if (role === "admin") return "You are a helpful assistant for admins, helping with reports and management.";
//   return "You are a helpful assistant.";
// }

export const chatWithBot = async (req, res) => {
  try {
    const { role, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system",  content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Something went wrong with the chatbot" });
  }
};
