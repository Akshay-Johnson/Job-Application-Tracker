"use client";

import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/dist/client/components/navigation";
import { DropdownMenu, DropdownMenuItem } from "./ui/dropdown-menu";

export default function SignOutBtn() {
  const router = useRouter();
  return (
    <DropdownMenuItem
      onClick={async () => {
        await signOut();
        const result = await signOut();
        if (result.data) {
          router.push("/sign-in");
        } else {
          alert("Failed to log out. Please try again.");
        }
      }}
      className="text-gray-700 hover:text-black"
    >
      Log Out
    </DropdownMenuItem>
  );
}
