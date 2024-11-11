import { redirect } from "next/navigation";
import { GitBranchIcon } from "lucide-react";

import { auth, signIn } from "@/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  return (
    <>
      {session && session.user ? (
        redirect("/chat")
      ) : (
        <Dialog open>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Sign in to your account</DialogTitle>
              <DialogDescription>
                Sign in to access your account and start chatting with our
                assistant.
              </DialogDescription>
            </DialogHeader>
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
              className="flex items-center justify-center py-4"
            >
              <Button
                type="submit"
                className="w-full max-w-sm"
                variant="outline"
              >
                <GitBranchIcon className="mr-2 size-4" /> Sign in with GitHub
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
