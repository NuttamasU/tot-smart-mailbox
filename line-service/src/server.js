
const express = require("express");
require("dotenv").config();

const { middleware } = require("@line/bot-sdk");
const { config } = require("./config/line");

const lineRoutes = require("./routes/line.routes");
const supabase = require("./config/supabase");

const app = express();
const PORT = process.env.PORT || 3000;

// LINE Webhook middleware must run before express.json()
app.use(
  "/api/line/webhook",
  middleware(config)
);

// Parse JSON for other routes
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Smart Mailbox LINE Service is running!",
  });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const { error } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (error) {
      return res.status(503).json({
        status: "error",
        database: "disconnected",
      });
    }

    return res.status(200).json({
      status: "ok",
      database: "connected",
    });

  } catch (error) {
    console.error("Health check failed:", error.message);

    return res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// LINE API Routes
app.use("/api/line", lineRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
