const { generateAIResponse } = require("../../services/User/ai.service");

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [], userId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const currentUserId = req.user?._id || req.user?.id || userId;

    const result = await generateAIResponse(
      message.trim(),
      Array.isArray(history) ? history : [],
      currentUserId
    );

    const reply = typeof result === "string" ? result : result.reply;
    const users =
      typeof result === "object" && Array.isArray(result.users)
        ? result.users
        : [];
    const archetype = typeof result === "object" ? result.archetype : null;

    return res.status(200).json({
      success: true,
      reply,
      users,
      archetype,
    });
  } catch (error) {
    console.error(
      "AI Controller Error:",
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
