
const axios = require("axios");
const User = require("../../models/user.model");

const QWEN_API_URL = `${
  process.env.QWEN_BASE_URL ||
  "https://token-plan.maas.qwencloudapi.com/compatible-mode/v1"
}/chat/completions`;

const MODEL = process.env.QWEN_MODEL || "qwen3.7-plus";

const COFINDER_SYSTEM_PROMPT = `
You are Nova, the official AI founder copilot and matching assistant for Co-Finder.

YOUR RESPONSIBILITIES:

1. Help founders discover co-founders, collaborators and team members.
2. Understand natural language requests without restricting users to predefined keywords.
3. Interpret requirements based on:
   - Archetype
   - Skills
   - Professional background
   - Experience
   - Interests
   - Industry
   - Goals
   - Location
   - About/profile description

PEOPLE RECOMMENDATION RULES:

1. Recommend ONLY real users provided in DATABASE RESULTS.
2. Never invent names, IDs, usernames, archetypes or profile details.
3. Match users based on the complete meaning of the user's request.
4. A user can be relevant even if their archetype does not exactly match the requested profession.
5. Consider multiple archetypes and backgrounds.
6. If exact matches are unavailable, recommend the closest relevant profiles.
7. Do not return irrelevant users just to fill the list.
8. Never expose email, password or private information.

STRICT RESPONSE FORMAT FOR PEOPLE RECOMMENDATIONS:

When DATABASE RESULTS are provided:

1. Give ONLY a short, natural conversational introduction.
2. Keep the response to 1-2 sentences maximum.
3. Do NOT list individual users.
4. Do NOT output names, usernames, IDs, archetypes, profile picture URLs, profile links or background details.
5. Do NOT reproduce or summarize DATABASE RESULTS.
6. Do NOT create Markdown headings or bullet lists for recommended users.
7. The frontend independently displays user cards using the users array.
8. Never duplicate information that the frontend will display in cards.

Example:
"Here are a few founders who could be a good match for your requirements. Take a look at their profiles and see who aligns with your goals."

If no matching users are provided:
Politely tell the user that no matching profiles were found.

GENERAL QUESTIONS:

For general startup, business, technology and Co-Finder questions, provide concise and actionable answers.

Use Markdown when helpful for normal conversational answers.

Always be helpful, natural and founder-focused.
`;

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getUserData = (user) => ({
  _id: user._id.toString(),
  name: user.displayName || user.name || "Founder",
  username: user.username || "",
  archetype: user.archetype || "Founder",
  about: user.about || "",
  location: user.location || "",
  profileImage: user.profileImage || "",
  profileImageType: user.profileImageType || "avatar",
  profileLink: `/user-profile/${user._id}`,
});

const buildFallbackResponse = (users) => {
  if (!users.length) {
    return "I couldn't find matching profiles in the Co-Finder community right now. Try exploring other backgrounds or skills.";
  }

  return "Here are a few founders from the Co-Finder community who could be a good match for your requirements. Explore their profiles and connect with the ones who align with your goals.";
};

const generateAIResponse = async (
  message,
  history = [],
  currentUserId
) => {
  try {
    const currentUser = currentUserId
      ? await User.findById(currentUserId)
          .select("archetype name displayName")
          .lean()
      : null;

    const normalizedMessage = message.toLowerCase().trim();

    const asksForPeople =
      /\b(find|suggest|recommend|show|search|discover|people|person|founders?|cofounders?|co-founders?|users?|profiles?|matching|matches|talent|members?|partners?|team|candidates?|who is|who are|anyone|list|connect)\b/i.test(
        message
      );

    const asksForSameArchetype =
      /\b(my archetype|same archetype|similar archetype|people like me|users like me|my type|matching my archetype)\b/i.test(
        message
      );

    const availableArchetypes = await User.distinct("archetype", {
      role: "user",
      archetype: { $type: "string", $ne: "" },
    });

    let matchedArchetypes = availableArchetypes.filter((archetype) => {
      if (!archetype) return false;

      const clean = archetype.trim().toLowerCase();

      return (
        clean.length > 0 &&
        normalizedMessage.includes(clean)
      );
    });

    if (asksForSameArchetype && currentUser?.archetype) {
      matchedArchetypes.unshift(currentUser.archetype);
    }

    matchedArchetypes = [...new Set(matchedArchetypes)];

    const discoveryIntent =
      asksForPeople ||
      asksForSameArchetype ||
      /\b(background|archetype|skills|experience|industry|profession|field|domain|designer|developer|marketing|finance|business|technology|startup)\b/i.test(
        message
      );

    let matchingUsers = [];

    if (discoveryIntent) {
      const baseQuery = {
        role: "user",
        ...(currentUserId
          ? { _id: { $ne: currentUserId } }
          : {}),
      };

      const users = await User.find(baseQuery)
        .select(
          "_id name username displayName archetype about location role profileImage profileImageType"
        )
        .limit(300)
        .lean();

      const promptWords = normalizedMessage
        .split(/[^a-z0-9+#]+/)
        .filter((word) => word.length > 2);

      const scoredUsers = users.map((user) => {
        const archetype = (user.archetype || "").toLowerCase();
        const about = (user.about || "").toLowerCase();
        const name = (user.displayName || user.name || "").toLowerCase();
        const username = (user.username || "").toLowerCase();
        const location = (user.location || "").toLowerCase();

        const combinedText = [
          archetype,
          about,
          name,
          username,
          location,
        ].join(" ");

        let score = 0;

        if (
          matchedArchetypes.some(
            (a) => a.toLowerCase() === archetype
          )
        ) {
          score += 12;
        }

        if (
          matchedArchetypes.some(
            (a) =>
              archetype.includes(a.toLowerCase()) ||
              a.toLowerCase().includes(archetype)
          )
        ) {
          score += 6;
        }

        for (const word of promptWords) {
          const regex = new RegExp(
            `\\b${escapeRegex(word)}\\b`,
            "i"
          );

          if (regex.test(archetype)) score += 5;
          if (regex.test(about)) score += 3;
          if (regex.test(name)) score += 2;
          if (regex.test(username)) score += 1;
          if (regex.test(location)) score += 1;
        }

        if (about.length > 30) score += 1;

        return {
          user,
          score,
        };
      });

      matchingUsers = scoredUsers
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 15)
        .map((item) => item.user);

      if (matchingUsers.length === 0) {
        matchingUsers = users
          .filter((user) => user.archetype || user.about)
          .slice(0, 10);
      }

      if (matchingUsers.length < 3 && matchingUsers.length > 0) {
        const existingIds = new Set(
          matchingUsers.map((u) => u._id.toString())
        );

        const additionalUsers = users
          .filter(
            (u) =>
              !existingIds.has(u._id.toString()) &&
              (u.archetype || u.about)
          )
          .slice(0, 3 - matchingUsers.length);

        matchingUsers.push(...additionalUsers);
      }
    }

    const responseUsers = matchingUsers.map(getUserData);

    const databaseContext = responseUsers.length
      ? `
DATABASE RESULTS — VERIFIED CO-FINDER USERS:

${JSON.stringify(responseUsers, null, 2)}

IMPORTANT:
These are verified profiles retrieved from the database.

Use them ONLY to understand and determine relevant recommendations.

NEVER reproduce these records in your response.
NEVER output names, usernames, IDs, archetypes, profile image URLs, profile links or background details.
NEVER create bullet lists or headings for these users.

Return only a short conversational introduction of 1-2 sentences.
The frontend will independently render the actual user cards from the users array.
`
      : discoveryIntent
        ? "No matching user profiles were found in the database. Do not invent or recommend any profiles."
        : "";

    if (!process.env.QWEN_API_KEY) {
      return {
        reply: discoveryIntent
          ? buildFallbackResponse(matchingUsers)
          : "Nova AI requires an AI provider API key to answer general questions.",
        users: responseUsers,
        archetype: matchedArchetypes[0] || null,
      };
    }

    const safeHistory = history
      .filter(
        (item) =>
          item &&
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string"
      )
      .slice(-8)
      .map((item) => ({
        role: item.role,
        content:
          item.role === "assistant" && item.users?.length
            ? "I suggested some matching Co-Finder profiles."
            : item.content,
      }));

    const messages = [
      {
        role: "system",
        content: COFINDER_SYSTEM_PROMPT,
      },
      ...safeHistory,
      {
        role: "user",
        content: `${message}\n\n${databaseContext}`,
      },
    ];

    try {
      const response = await axios.post(
        QWEN_API_URL,
        {
          model: MODEL,
          messages,
          stream: false,
          temperature: 0.3,
          max_tokens: 500,
          enable_thinking: false,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.QWEN_API_KEY.trim()}`,
            "Content-Type": "application/json",
          },
          timeout: 25000,
        }
      );

      const content =
        response.data?.choices?.[0]?.message?.content;

      if (!content || typeof content !== "string") {
        throw new Error("Empty response from AI provider");
      }

      return {
        reply: discoveryIntent && responseUsers.length
          ? content.trim()
          : content.trim(),
        users: responseUsers,
        archetype: matchedArchetypes[0] || null,
      };
    } catch (llmError) {
      console.warn(
        "External LLM error, using fallback:",
        llmError.message
      );

      return {
        reply: discoveryIntent
          ? buildFallbackResponse(matchingUsers)
          : "I'm temporarily unable to connect to my AI service. Please try again.",
        users: responseUsers,
        archetype: matchedArchetypes[0] || null,
      };
    }
  } catch (error) {
    console.error("generateAIResponse error:", error.message);
    throw error;
  }
};

module.exports = {
  generateAIResponse,
};
