import Image from "next/image";
import Markdown from "react-markdown";
import { DocumentData } from "@firebase/firestore";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Message = ({ message }: { message: DocumentData }) => {
  const isAIMessage = message.user._id === "ask-gpt";

  return (
    <div
      key={message.id}
      className={`flex mb-4 ${isAIMessage ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex items-start max-w-[80%] ${
          isAIMessage ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <Avatar className="size-8">
          <AvatarImage src={message.user.avatar} />
          <AvatarFallback>
            {`${message.user.name
              ?.split(" ")
              .map((name: string) => name[0])
              .join("")}`}
          </AvatarFallback>
        </Avatar>

        <div className="mx-2 space-y-2">
          {message.imageUrl && (
            <div className="flex justify-end">
              <Image
                src={message.imageUrl}
                alt="Uploaded Image"
                width={1000}
                height={1000}
                className="rounded-lg w-auto h-40 object-cover"
              />
            </div>
          )}

          <div
            className={`p-3 rounded-lg ${
              isAIMessage
                ? "bg-secondary"
                : "bg-primary text-primary-foreground"
            }`}
          >
            <Markdown>{message.text}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};
