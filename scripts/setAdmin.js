// One-time script to set a user as seller/admin
// Run with: node scripts/setAdmin.js

import { clerkClient } from '@clerk/nextjs/server';

async function setAdminRole() {
  try {
    const client = await clerkClient();

    // Find user by email
    const users = await client.users.getUserList({
      emailAddress: ['duongtrongnghia287@gmail.com']
    });

    if (users.data.length === 0) {
      console.error('User not found with email: duongtrongnghia287@gmail.com');
      return;
    }

    const user = users.data[0];
    console.log('Found user:', user.id);

    // Update user metadata to add seller role
    await client.users.updateUser(user.id, {
      publicMetadata: {
        role: 'seller'
      }
    });

    console.log('✅ Successfully set user as seller/admin!');
    console.log('User ID:', user.id);
    console.log('Email:', user.emailAddresses[0].emailAddress);
  } catch (error) {
    console.error('Error setting admin role:', error.message);
  }
}

setAdminRole();
