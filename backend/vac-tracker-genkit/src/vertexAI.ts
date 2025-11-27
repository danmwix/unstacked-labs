// src/vertexAI.ts
import { PredictionServiceClient } from "@google-cloud/aiplatform";

const client = new PredictionServiceClient({
  keyFilename: "./vertex-service-account.json",
});

const PROJECT_ID = "vac-tracker-app-eac07";
const LOCATION = "us-central1";
const MODEL = "gemini-1.5-flash";

export async function generateGeminiResponse(
  userMessage: string,
  history: Array<{ role: "user" | "model"; parts: { text: string }[] }> = []
): Promise<string> {
  try {
    const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}`;

    const contents = [
      ...history,
      { role: "user", parts: [{ text: userMessage }] }
    ];

    const [response] = await client.predict({
      endpoint,
      instances: [{ contents }],
    });

    const candidates = response?.predictions?.[0]?.structValue?.fields?.candidates;
    const text = candidates?.listValue?.values?.[0]?.structValue?.fields?.content?.structValue?.fields?.parts?.listValue?.values?.[0]?.structValue?.fields?.text?.stringValue;

    return text?.trim() || "I'm not sure how to respond.";
  } catch (err: any) {
    console.error("Gemini API Error:", err.message || err);
    return "Sorry, I'm having trouble connecting right now.";
  }
}