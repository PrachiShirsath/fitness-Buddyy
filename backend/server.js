require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { WatsonXAI } = require("@ibm-cloud/watsonx-ai");

// Keep the process alive even if IBM SDK or network throws an unhandled rejection
process.on("uncaughtException",     (err) => console.error("uncaughtException:", err.message));
process.on("unhandledRejection",    (err) => console.error("unhandledRejection:", err?.message || err));

const app = express();
app.use(cors());
app.use(express.json());

// IBM watsonx.ai client — created lazily on first use so a missing .env
// never crashes the process at startup.
let _watsonxClient = null;
function getClient() {
  if (!_watsonxClient) {
    const { IamAuthenticator } = require("ibm-cloud-sdk-core");
    _watsonxClient = WatsonXAI.newInstance({
      version: "2024-05-31",
      serviceUrl: process.env.IBM_WATSONX_URL || "https://us-south.ml.cloud.ibm.com",
      authenticator: new IamAuthenticator({ apikey: process.env.IBM_WATSONX_APIKEY }),
    });
  }
  return _watsonxClient;
}

const PROJECT_ID = process.env.IBM_WATSONX_PROJECT_ID;

// System prompt for Fitness Buddy persona
const SYSTEM_PROMPT = `You are Fitness Buddy, a friendly, knowledgeable, and motivating AI-powered health and fitness coach. Your role is to:

1. WORKOUTS: Recommend specific home workout routines based on user goals, fitness level, available time, and equipment. Provide sets, reps, and clear instructions.
2. NUTRITION: Suggest simple, nutritious meal ideas and healthy eating habits tailored to the user's dietary preferences and fitness goals.
3. MOTIVATION: Provide daily fitness inspiration, motivational quotes, habit-building tips, and encouragement to stay consistent.
4. HABITS: Help users build sustainable healthy habits, track progress concepts, and stay accountable.

Guidelines:
- Be warm, encouraging, and supportive — like a personal trainer and nutritionist friend.
- Give actionable, specific advice — not vague suggestions.
- Always ask clarifying questions when needed (fitness level, goals, dietary restrictions, available time).
- For workouts, specify exercise name, sets x reps, rest time, and modifications for beginners.
- For meals, provide simple recipes with ingredients and quick prep steps.
- Use motivational language and celebrate small wins.
- Always prioritize safety — advise consulting a doctor for medical conditions.
- Keep responses concise but complete. Use bullet points and structured formatting.

You ONLY discuss health, fitness, nutrition, wellness, and motivation topics. Politely redirect off-topic questions back to fitness and health.`;

// Shared watsonx error handler
function handleWatsonxError(error, res) {
  console.error("watsonx error  status=%s  msg=%s", error.status, error.message);
  const body = (() => {
    try { return typeof error.body === "string" ? JSON.parse(error.body) : (error.body || {}); }
    catch { return {}; }
  })();

  // Rate limit (429)
  if (error.status === 429 || error.message?.includes("usage limit") || error.message?.includes("concurrent requests")) {
    return res.status(429).json({
      error: "IBM Granite is busy right now (free tier rate limit). Please wait a few seconds and try again.",
    });
  }
  // IAM / credential error
  if (body.errorCode?.includes("BXNIM") || error.message?.includes("apikey") || error.message?.includes("credentials")) {
    return res.status(401).json({
      error: "IBM API key is invalid or not found.",
      hint: "Go to cloud.ibm.com → Manage → API Keys, create a fresh key, paste it in backend/.env",
    });
  }
  // Project not found
  if (error.status === 404 || error.message?.includes("project_id") || error.message?.includes("find project")) {
    return res.status(404).json({
      error: "watsonx project not found.",
      hint: "Go to dataplatform.cloud.ibm.com → create a new project → copy the Project ID into backend/.env as IBM_WATSONX_PROJECT_ID",
    });
  }
  // SDK param validation
  if (error.message?.includes("invalid parameters") || error.message?.includes("Parameter validation")) {
    return res.status(500).json({ error: "SDK parameter error: " + error.message });
  }
  return res.status(500).json({ error: error.message || "Unexpected error from IBM watsonx." });
}

// Build conversation messages for IBM Granite
function buildMessages(conversationHistory, userMessage) {
  const messages = [{ role: "system", content: SYSTEM_PROMPT }];
  conversationHistory.forEach((msg) => {
    messages.push({ role: msg.role, content: msg.content });
  });
  messages.push({ role: "user", content: userMessage });
  return messages;
}

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message, conversationHistory = [], userProfile = {} } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Enrich message with user profile context if available
  let enrichedMessage = message;
  if (userProfile && Object.keys(userProfile).length > 0) {
    const profileContext = [];
    if (userProfile.fitnessLevel) profileContext.push(`Fitness Level: ${userProfile.fitnessLevel}`);
    if (userProfile.goal) profileContext.push(`Goal: ${userProfile.goal}`);
    if (userProfile.age) profileContext.push(`Age: ${userProfile.age}`);
    if (userProfile.dietaryPreference) profileContext.push(`Diet: ${userProfile.dietaryPreference}`);
    if (profileContext.length > 0) {
      enrichedMessage = `[User Profile - ${profileContext.join(", ")}]\n\n${message}`;
    }
  }

  const messages = buildMessages(conversationHistory, enrichedMessage);

  try {
    const response = await getClient().textChat({
      modelId: "ibm/granite-4-h-small",
      projectId: PROJECT_ID,
      messages: messages,
      maxTokens: 1024,
      temperature: 0.7,
      topP: 0.95,
      repetitionPenalty: 1.1,
    });

    const assistantMessage =
      response.result?.choices?.[0]?.message?.content ||
      "I'm here to help with your fitness journey! Could you please rephrase your question?";

    res.json({
      response: assistantMessage,
      model: "ibm/granite-4-h-small",
    });
  } catch (error) {
    return handleWatsonxError(error, res);
  }
});

// Quick suggestion endpoints
app.post("/api/workout", async (req, res) => {
  const { fitnessLevel = "beginner", goal = "general fitness", duration = "30", equipment = "none" } = req.body;

  const prompt = `Create a complete ${duration}-minute home workout routine for a ${fitnessLevel} level person with goal: ${goal}. Equipment available: ${equipment}. Include warm-up, main workout, and cool-down with specific exercises, sets, reps, and rest times.`;

  req.body.message = prompt;
  req.body.conversationHistory = [];

  const messages = buildMessages([], prompt);

  try {
    const response = await getClient().textChat({
      modelId: "ibm/granite-4-h-small",
      projectId: PROJECT_ID,
      messages,
      maxTokens: 1200,
      temperature: 0.7,
    });

    const workout = response.result?.choices?.[0]?.message?.content || "Unable to generate workout plan.";
    res.json({ workout });
  } catch (error) {
    return handleWatsonxError(error, res);
  }
});

app.post("/api/meal", async (req, res) => {
  const { mealType = "breakfast", dietaryPreference = "none", calories = "moderate" } = req.body;

  const prompt = `Suggest 3 healthy ${mealType} ideas for someone with dietary preference: ${dietaryPreference} and ${calories} calorie needs. Include brief ingredients and 2-3 step preparation for each.`;

  const messages = buildMessages([], prompt);

  try {
    const response = await getClient().textChat({
      modelId: "ibm/granite-4-h-small",
      projectId: PROJECT_ID,
      messages,
      maxTokens: 1000,
      temperature: 0.7,
    });

    const meals = response.result?.choices?.[0]?.message?.content || "Unable to generate meal suggestions.";
    res.json({ meals });
  } catch (error) {
    return handleWatsonxError(error, res);
  }
});

app.get("/api/motivation", async (req, res) => {
  const prompts = [
    "Give me one powerful fitness motivational quote and a 3-sentence explanation of why consistency matters more than intensity.",
    "Share a science-backed tip for building a lasting fitness habit, with a practical daily action step.",
    "Provide an encouraging message for someone who missed their workout yesterday, with a quick 10-minute recovery plan.",
  ];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  const messages = buildMessages([], prompt);

  try {
    const response = await getClient().textChat({
      modelId: "ibm/granite-4-h-small",
      projectId: PROJECT_ID,
      messages,
      maxTokens: 400,
      temperature: 0.9,
    });

    const motivation = response.result?.choices?.[0]?.message?.content || "Keep going — every step counts!";
    res.json({ motivation });
  } catch (error) {
    return handleWatsonxError(error, res);
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Fitness Buddy API",
    model: "ibm/granite-4-h-small",
    watsonxConfigured: !!(process.env.IBM_WATSONX_APIKEY && process.env.IBM_WATSONX_PROJECT_ID),
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🏋️  Fitness Buddy Backend running on port ${PORT}`);
  console.log(`📡  IBM watsonx.ai Model: ibm/granite-4-h-small`);
  console.log(`✅  Health check: http://localhost:${PORT}/api/health\n`);
});
