const { getMessaging } = require("firebase-admin/messaging");
const firebaseApp = require("../../config/firebaseAdmin");

const sendPushNotification = async ({
  tokens,
  title,
  body,
  data = {},
}) => {
  if (!tokens || tokens.length === 0) {
    return;
  }

  const uniqueTokens = [...new Set(tokens.filter(Boolean))];

  const message = {
    tokens: uniqueTokens,

    data: {
      title: String(title || "CoFinder"),
      body: String(body || "You have a new notification"),

      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          String(value),
        ])
      ),
    },
  };

  const response = await getMessaging(firebaseApp)
    .sendEachForMulticast(message);

  console.log(
    `FCM: ${response.successCount} sent, ${response.failureCount} failed`
  );

  return response;
};

module.exports = {
  sendPushNotification,
};