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

  const message = {
    tokens,

    notification: {
      title,
      body,
    },

    data: Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        String(value),
      ])
    ),
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