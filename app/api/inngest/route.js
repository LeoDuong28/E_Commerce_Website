import { serve } from "inngest/next";
import {
  inngest,
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  createUserOrder,
} from "@/config/inngest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const handler = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    createUserOrder,
  ],
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
