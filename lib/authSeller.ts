import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const authSeller = async (userId: string): Promise<boolean | NextResponse> => {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return user.publicMetadata.role === 'seller';
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, message });
  }
};

export default authSeller;
