import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import authSeller from "@/lib/authSeller";

import Navbar from "@/components/seller/Navbar";
import Sidebar from "@/components/seller/Sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const isSeller = await authSeller(userId);
  if (typeof isSeller !== "boolean" || !isSeller) redirect("/");

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
