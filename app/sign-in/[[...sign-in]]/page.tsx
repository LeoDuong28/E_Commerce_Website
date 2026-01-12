import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
      <SignIn />
    </main>
  );
}
