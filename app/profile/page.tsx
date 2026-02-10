"use client";

import { useState } from "react";
import { updatePassword, deleteAccount } from "@/lib/auth/account-actions";
import { signOut } from "@/lib/auth/auth-client";

export default function ProfilePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");


  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();

    const res = await updatePassword(currentPassword, newPassword);

    if (!res.success) {
      alert(res.error);
      return;
    }

    alert("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
  }

  async function handleDeleteAccount() {
    const confirmDelete = confirm(
      "Are you sure? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    const res = await deleteAccount();

    if (!res.success) {
      alert(res.error);
      return;
    }

    await signOut();
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      {/* Update Password */}
      <form
        onSubmit={handlePasswordUpdate}
        className="space-y-4 border p-4 rounded"
      >
        <h2 className="font-semibold">Update Password</h2>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Update Password
        </button>
      </form>

      
      </div>

  );
}
