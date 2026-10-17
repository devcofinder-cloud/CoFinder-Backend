
const axios = require("axios");
const User = require("../../models/user.model");

const QWEN_API_URL = `${
  process.env.QWEN_BASE_URL ||
  "https://token-plan.maas.qwencloudapi.com/compatible-mode/v1"
}/chat/completions`;

const MODEL = process.env.QWEN_MODEL || "qwen3.7-plus";

const COFINDER_SYSTEM_PROMPT = `
You are the official AI assistant for Co-Finder.

You help users discover founders and use Co-Finder features.

You can answer questions about:
- Co-Founder discovery and recommendations
- User profiles and archetypes
- Connections and messaging
- Posts, projects and notifications
- Registration, login and account settings

When actual matching user profiles are provided, recommend only those users.
Never invent user names, archetypes or profile information.
If no matching profiles are provided, clearly say no matching profiles were found.
Do not expose private information such as email, password or internal IDs.

For unrelated questions, respond exactly:
"I can only help you with Co-Finder and its features."

Keep responses concise, helpful and easy to understand.
`;

const generateAIResponse = async (message, history = [], currentUserId) => {
  if (!process.env.QWEN_API_KEY) {
    throw new Error("QWEN_API_KEY is missing");
  }

  const archetypeMatch = message.match(
    /\b(?:archetype|archetypes|type)\s*(?:is|:|=)?\s*["']?([a-z0-9 _-]{2,50})["']?/i
  );

  const asksForPeople =
    /\b(suggest|recommend|find|show|search|discover|people|founders|users|matching|same archetype|similar archetype)\b/i.test(
      message
    );

  let matchingUsers = [];

  if (asksForPeople && archetypeMatch) {
    const requestedArchetype = archetypeMatch[1]
      .trim()
      .replace(/[?.!,]+$/, "");

    matchingUsers = await User.find({
      archetype: {
        $regex: `^${requestedArchetype.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
      _id: { $ne: currentUserId },
      role: "user",
    })
      .select("name username displayName archetype profileImage profileImageType")
      .limit(10)
      .lean();
  }

  const databaseContext =
    matchingUsers.length > 0
      ? `Actual matching Co-Finder users from MongoDB:\n${JSON.stringify(
          matchingUsers.map((user) => ({
            name: user.displayName || user.name,
            username: user.username || null,
            archetype: user.archetype,
            profileImage: user.profileImage || null,
            profileImageType: user.profileImageType || null,
          }))
        )}\nRecommend only these users.`
      : asksForPeople && archetypeMatch
        ? `No matching users were found for archetype "${archetypeMatch[1].trim()}". Do not invent profiles.`
        : "";

  const messages = [
    {
      role: "system",
      content: COFINDER_SYSTEM_PROMPT,
    },
    ...history.filter(
      (item) =>
        item &&
        ["user", "assistant"].includes(item.role) &&
        typeof item.content === "string"
    ),
    {
      role: "user",
      content: databaseContext
        ? `${message}\n\n${databaseContext}`
        : message,
    },
  ];

  try {
    const response = await axios.post(
      QWEN_API_URL,
      {
        model: MODEL,
        messages,
        stream: false,
        temperature: 0,
        max_tokens: 300,
        enable_thinking: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Qwen API returned an empty response");
    }

    return content.trim();
  } catch (error) {
    console.error(
      "Qwen API Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to generate AI response");
  }
};

module.exports = {
  generateAIResponse,
};
