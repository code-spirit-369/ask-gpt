"use client";

import { Session } from "next-auth";
import { SendIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";

import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessages } from "@/components/chat-messages";

export const Chatbox = ({ session }: { session: Session }) => {
  const user = session.user!;
  const chatId = usePathname().split("/").pop()!;

  const [prompt, setPrompt] = useState("");

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt) return;

    const input = prompt.trim();
    setPrompt("");

    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: user.email!,
        name: user.name!,
        avatar: user.image!,
      },
    };

    await addDoc(
      collection(db, "users", user.email!, "chats", chatId, "messages"),
      message
    );

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
        chatId,
        user,
      }),
    });
  };

  return (
    <>
      <ChatMessages chatId={chatId} session={session} />

      <div className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <Input
            type="text"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Message AskGPT"
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <SendIcon className="size-4" />
          </Button>
        </form>
      </div>
    </>
  );
};
