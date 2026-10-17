const { generateAIResponse } = require("../../services/User/ai.service");

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

   const reply = await generateAIResponse(
  message.trim(),
  Array.isArray(history) ? history : [],
  req.user?._id || req.user?.id
);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "Ollama Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "AI service is currently unavailable",
    });
  }
};

module.exports = {
  chatWithAI,
};