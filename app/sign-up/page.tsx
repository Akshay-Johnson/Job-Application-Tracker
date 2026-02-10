import { Suspense } from "react";
import SignUpForm from "./SignUpForm";
import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

async function Guard() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <SignUpForm />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Guard />
    </Suspense>
  );
}
