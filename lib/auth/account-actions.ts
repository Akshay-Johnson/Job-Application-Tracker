"use server";

import { auth } from "./auth";
import { headers } from "next/headers";

export async function updatePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    const result = await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
      },
    });

    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error?.body?.message || "Failed to update password",
    };
  }
}

export async function deleteAccount() {
  try {
    const result = await auth.api.deleteUser({
        headers: await headers(),
        body: {},
    });

    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error?.body?.message || "Failed to delete account",
    };
  }
}

