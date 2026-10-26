
const axios = require("axios");
const User = require("../../models/user.model");

const QWEN_API_URL = `${
  process.env.QWEN_BASE_URL ||
  "https://token-plan.maas.qwencloudapi.com/compatible-mode/v1"
}/chat/completions`;

const MODEL = process.env.QWEN_MODEL || "qwen3.7-plus";

const COFINDER_SYSTEM_PROMPT = `
You are Nova, the official AI assistant for Co-Finder.

Help users with Co-Finder features, co-founder discovery, user archetypes,
connections, messaging, projects, and account features.

When recommending people:
- Recommend only users provided from the database.
- Never invent names, usernames, archetypes, or profile details.
- If no profiles are provided, clearly say no matching profiles were found.
- Never reveal email addresses, passwords, tokens, or internal IDs.
- Present recommendations as a readable bullet list.
- For each person, show their name and archetype when available.

For unrelated questions, respond exactly:
"I can only help you with Co-Finder and its features."

Keep responses concise and helpful.
`;

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const generateAIResponse = async (
  message,
  history = [],
  currentUserId
) => {
  if (!process.env.QWEN_API_KEY) {
    throw new Error("QWEN_API_KEY is missing");
  }

  try {
    const currentUser = currentUserId
      ? await User.findById(currentUserId)
          .select("archetype")
          .lean()
      : null;

    const asksForPeople =
      /\b(suggest|recommend|find|show|search|discover|people|founders|users|profiles|matching|matches|same archetype|similar archetype)\b/i.test(
        message
      );

    const asksForSameArchetype =
      /\b(my archetype|same archetype|similar archetype|people like me|users like me|my type)\b/i.test(
        message
      );

    const availableArchetypes = await User.distinct("archetype", {
      role: "user",
      archetype: { $type: "string", $ne: "" },
    });

    const normalizedMessage = message.toLowerCase();

    let requestedArchetype = availableArchetypes.find((archetype) => {
      const value = String(archetype || "").trim();

      return (
        value.length > 0 &&
        normalizedMessage.includes(value.toLowerCase())
      );
    });

    if (!requestedArchetype && asksForSameArchetype) {
      requestedArchetype = currentUser?.archetype;
    }

    if (!requestedArchetype && asksForPeople) {
      const previousUserMessages = history
        .filter(
          (item) =>
            item?.role === "user" &&
            typeof item.content === "string"
        )
        .slice(-5)
        .map((item) => item.content.toLowerCase());

      requestedArchetype = availableArchetypes.find((archetype) => {
        const value = String(archetype || "").trim().toLowerCase();

        return (
          value.length > 0 &&
          previousUserMessages.some((previousMessage) =>
            previousMessage.includes(value)
          )
        );
      });

      if (!requestedArchetype) {
        requestedArchetype = currentUser?.archetype;
      }
    }

    let matchingUsers = [];

    if (asksForPeople && requestedArchetype) {
      const userQuery = {
        role: "user",
        archetype: {
          $regex: `^${escapeRegex(
            String(requestedArchetype).trim()
          )}$`,
          $options: "i",
        },
      };

      if (currentUserId) {
        userQuery._id = { $ne: currentUserId };
      }

      matchingUsers = await User.find(userQuery)
        .select("name username displayName archetype profileImage profileImageType")
        .limit(10)
        .lean();

      console.log("Nova requested archetype:", requestedArchetype);
      console.log("Nova matching profiles:", matchingUsers.length);
    }

    let databaseContext = "";

    if (asksForPeople) {
      if (matchingUsers.length > 0) {
        databaseContext = `
DATABASE RESULTS — REAL CO-FINDER USERS

Requested archetype: ${requestedArchetype}

${JSON.stringify(
  matchingUsers.map((user) => ({
    name: user.displayName || user.name,
    username: user.username || null,
    archetype: user.archetype,
    profileImage: user.profileImage || null,
    profileImageType: user.profileImageType || null,
  }))
)}

Recommend only these database results.
`;
      } else if (requestedArchetype) {
        databaseContext = `
No Co-Finder users were found for the archetype "${requestedArchetype}".
Do not invent users. Explain that no matching profiles were found.
`;
      } else {
        databaseContext = `
No archetype could be identified from the request.
Ask the user to mention an archetype available on Co-Finder.
Do not invent users.
`;
      }
    }

    const safeHistory = history
      .filter(
        (item) =>
          item &&
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string"
      )
      .slice(-10);

    const messages = [
      {
        role: "system",
        content: COFINDER_SYSTEM_PROMPT,
      },
      ...safeHistory,
      {
        role: "user",
        content: databaseContext
          ? `${message}\n\n${databaseContext}`
          : message,
      },
    ];

    const response = await axios.post(
      QWEN_API_URL,
      {
        model: MODEL,
        messages,
        stream: false,
        temperature: 0,
        max_tokens: 500,
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

    if (!content || typeof content !== "string") {
      throw new Error("Qwen API returned an empty response");
    }

    return content.trim();
  } catch (error) {
    console.error(
      "Nova AI Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to generate AI response");
  }
};

module.exports = {
  generateAIResponse,
};
