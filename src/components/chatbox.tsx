"use client";

import Image from "next/image";
import { v4 as uuid4 } from "uuid";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { Loader2Icon, PaperclipIcon, SendIcon, XIcon } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import { db, storage } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessages } from "@/components/chat-messages";

export const Chatbox = ({ session }: { session: Session }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const user = session.user!;
  const chatId = usePathname().split("/").pop()!;

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    let imageUrl = "";

    if (image) {
      setLoading(true);
      const imageRef = storageRef(storage, `images/${uuid4()}`);

      await uploadBytes(imageRef, image).then((snapshot) =>
        getDownloadURL(snapshot.ref)
          .then((url) => {
            imageUrl = url;
            setImage(null);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error uploading image: ", error);
          })
      );
    }

    const input = prompt.trim();

    const message: Message = {
      text: input,
      imageUrl,
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
        imageUrl,
        chatId,
        user,
      }),
    });

    setPrompt("");
    setLoading(false);
  };

  return (
    <>
      <ChatMessages chatId={chatId} session={session} />

      <div className="p-4 border-t space-y-4">
        {image && (
          <div className="relative flex w-full justify-end">
            <div className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer">
              <XIcon
                className="size-4 text-black"
                onClick={() => setImage(null)}
              />
            </div>
            <Image
              src={URL.createObjectURL(image)}
              alt="Upload Image"
              width={1000}
              height={1000}
              className="rounded-lg h-40 w-auto object-cover"
            />
          </div>
        )}

        <form onSubmit={sendMessage} className="flex space-x-2">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={() => imageInputRef.current?.click()}
            disabled={loading}
          >
            <PaperclipIcon className="size-4" />
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          <Input
            type="text"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Message AskGPT"
            className="flex-grow"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={!prompt || loading}>
            {loading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SendIcon className="size-4" />
            )}
          </Button>
        </form>
      </div>
    </>
  );
};
