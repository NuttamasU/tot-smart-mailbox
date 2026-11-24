
const { client } = require("../config/line");

// Send text message
const sendTextMessage = async (userId, message) => {
  try {
    await client.pushMessage({
      to: userId,
      messages: [
        {
          type: "text",
          text: message,
        },
      ],
    });

    console.log("LINE message sent successfully");

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error) {
    console.error("LINE message error:", error.message);
    throw error;
  }
};

// Get LINE user profile
const getLineProfile = async (userId) => {
  try {
    const profile = await client.getProfile(userId);

    console.log("LINE profile retrieved successfully");

    return {
      success: true,
      data: {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      },
    };
  } catch (error) {
    console.error("LINE profile error:", error.message);
    throw error;
  }
};

module.exports = {
  sendTextMessage,
  getLineProfile,
};
