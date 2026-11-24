
const express = require("express");
const router = express.Router();

const {
  sendTextMessage,
  getLineProfile,
} = require("../services/line.service");

const {
  upsertLineUser,
  deactivateLineUser,
} = require("../services/user.service");

// Test sending LINE message
router.post("/test-message", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: "userId and message are required",
      });
    }

    const result = await sendTextMessage(userId, message);
    return res.json(result);
  } catch (error) {
    console.error("Test message error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send LINE message",
    });
  }
});

// Receive LINE Webhook Events
router.post("/webhook", async (req, res) => {
  try {
    const events = req.body.events || [];

    for (const event of events) {
      const userId = event.source?.userId;

      console.log("LINE Webhook Event:", event.type);

      if (!userId) {
        continue;
      }

      switch (event.type) {
        // User follows LINE OA
        case "follow": {
          console.log("A user followed the Smart Mailbox OA");

          const profile = await getLineProfile(userId);

          await upsertLineUser({
            lineUserId: profile.data.userId,
            displayName: profile.data.displayName,
          });

          console.log("LINE user saved to Supabase");

          break;
        }

        // User sends a message
        case "message": {
          console.log("A user sent a message");

          if (event.message?.type === "text") {
            console.log("Message:", event.message.text);
          }

          break;
        }

        // User unfollows LINE OA
        case "unfollow": {
          console.log("A user unfollowed the Smart Mailbox OA");

          await deactivateLineUser(userId);

          console.log("LINE user deactivated in Supabase");

          break;
        }

        default:
          console.log("Other LINE event:", event.type);
      }
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("LINE Webhook Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
});

module.exports = router;
