import { firestore } from "firebase-admin";
import { NextResponse } from "next/server";

import { xai } from "@/lib/xai";
import { adminDB } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  const { input, chatId, user } = await request.json();

  const res = await xai.chat.completions.create({
    model: "grok-beta",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: input,
      },
    ],
  });

  const response = res.choices[0].message.content;

  const message: Message = {
    text: response || "RTGPT was unable to find an answer for that!",
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
