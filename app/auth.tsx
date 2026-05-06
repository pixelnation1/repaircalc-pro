"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm signup.");
    }
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Logged in!");
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <input
        type="email"
        placeholder="Email"
        className="w-full bg-gray-800 border border-gray-700 text-white p-4 rounded-2xl"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full bg-gray-800 border border-gray-700 text-white p-4 rounded-2xl"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={signUp}
          className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-xl font-bold"
        >
          Sign Up
        </button>

        <button
          onClick={signIn}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl font-bold"
        >
          Login
        </button>
      </div>
    </div>
  );
}