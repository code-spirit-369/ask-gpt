import { xai } from "@ai-sdk/xai";
import { firestore } from "firebase-admin";
import { NextResponse } from "next/server";
import { generateText, UserContent } from "ai";

import { adminDB } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  const { input, imageUrl, chatId, user } = await request.json();

  const userMessage: UserContent = imageUrl
    ? [
        { type: "text", text: input },
        { type: "image", image: new URL(imageUrl) },
      ]
    : [{ type: "text", text: input }];

  const { text } = await generateText({
    model: xai("grok-vision-beta"),
    messages: [
      {
        role: "assistant",
        content: "You are a helpful assistant. Your name is Ask-GPT.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const message: Message = {
    text: text || "AskGPT was unable to find an answer for that!",
    createdAt: firestore.Timestamp.now(),
    user: {
      _id: "ask-gpt",
      name: "Ask-GPT",
      avatar: "https://cdn-icons-png.flaticon.com/512/1787/1787077.png",
    },
  };

  await adminDB
    .collection("users")
    .doc(user.email)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

  return NextResponse.json({ answer: message.text }, { status: 200 });
}
