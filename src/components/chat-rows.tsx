"use client";

import { Session } from "next-auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "@firebase/firestore";

import { db } from "@/lib/firebase";
import { ChatRow } from "@/components/chat-row";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export const ChatRows = ({ session }: { session: Session }) => {
  const user = session.user!;

  const [chats] = useCollection(
    session &&
      query(
        collection(db, "users", user.email!, "chats"),
        orderBy("createdAt", "desc")
      )
  );

  return (
    <>
      {chats?.docs.map((chat) => (
        <SidebarMenuItem key={chat.id}>
          <SidebarMenuButton asChild>
            <ChatRow chatId={chat.id} user={user} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};
