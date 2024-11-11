import Link from "next/link";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquareIcon, Trash2Icon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, deleteDoc, doc } from "@firebase/firestore";

import { db } from "@/lib/firebase";

export const ChatRow = ({ chatId, user }: { chatId: string; user: User }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isActive, setIsActive] = useState(false);

  const [messages] = useCollection(
    collection(db, "users", user.email!, "chats", chatId, "messages")
  );

  useEffect(() => {
    if (!pathname) return;

    setIsActive(pathname.includes(chatId));
  }, [pathname, chatId]);

  const handleDeleteChat = async () => {
    await deleteDoc(doc(db, "users", user.email!, "chats", chatId));
    router.replace("/chat");
  };

  return (
    <Link
      href={`/chat/${chatId}`}
      className={`flex items-center justify-between w-full p-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
        isActive && "bg-sidebar-accent text-sidebar-foreground"
      }`}
    >
      <MessageSquareIcon className="mr-2 size-4" />
      <p className="flex-1 truncate">
        {messages?.docs[0]?.data()?.text || "New Chat"}
      </p>

      <Trash2Icon
        onClick={handleDeleteChat}
        className="size-4 text-muted-foreground hover:text-red-500"
      />
    </Link>
  );
};
