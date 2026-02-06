import { clerkClient } from "@clerk/nextjs/server";
import { config } from "dotenv";

config();

const email = process.env.ADMIN_EMAIL;

async function setAdminRole() {
  if (!email) {
    console.error("ADMIN_EMAIL not set in .env");
    return;
  }

  try {
    const client = await clerkClient();

    const users = await client.users.getUserList({
      emailAddress: [email],
    });

    if (users.data.length === 0) {
      console.error("User not found with email:", email);
      return;
    }

    const user = users.data[0];
    console.log("Found user:", user.id);

    await client.users.updateUser(user.id, {
      publicMetadata: {
        role: "seller",
      },
    });

    console.log("Successfully set user as seller/admin!");
    console.log("User ID:", user.id);
  } catch (error) {
    console.error("Error setting admin role:", error.message);
  }
}

setAdminRole();
