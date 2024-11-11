import OpenAI from "openai";

export const xai = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY!,
});
