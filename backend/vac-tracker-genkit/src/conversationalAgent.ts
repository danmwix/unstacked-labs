// src/conversationalAgent.ts
import express from 'express';
import { db } from './firebase.ts';
import { generateGeminiResponse } from './vertexAI.ts';

const router = express.Router();

const MAX_HISTORY = 20;
const TTL_HOURS = 24;

async function handleConversation(userId: string, userMessage: string) {
  const convRef = db.collection('conversations').doc(userId);
  const convDoc = await convRef.get();

  let history: Array<{ role: 'user' | 'model'; parts: { text: string }[] }> = [];

  // Load existing conversation if not expired
  if (convDoc.exists) {
    const data = convDoc.data();
    const lastUpdated = data?.lastUpdated?.toDate();
    const hoursAgo = (Date.now() - lastUpdated?.getTime()) / (1000 * 60 * 60);

    if (lastUpdated && hoursAgo < TTL_HOURS) {
      history = data?.history || [];
    }
  }

  // Add user message
  history.push({ role: 'user', parts: [{ text: userMessage }] });

  // Generate AI reply
  const aiReply = await generateGeminiResponse(userMessage, history);

  // Add AI reply
  history.push({ role: 'model', parts: [{ text: aiReply }] });

  // Save back (trim + timestamp)
  await convRef.set({
    history: history.slice(-MAX_HISTORY),
    lastUpdated: new Date(),
  });

  return { reply: aiReply };
}

// ✅ API endpoint for frontend (Angular)
router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'Missing userId or message' });
    }

    const response = await handleConversation(userId, message);
    res.json(response);
  } catch (error) {
    console.error('Error in /chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
