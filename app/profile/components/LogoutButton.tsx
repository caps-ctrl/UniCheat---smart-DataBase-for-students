"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { signOut } from "../actions";
import styles from "../profile.module.css";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className={styles.logoutButton} type="submit" disabled={pending}>
      <LogOut size={18} aria-hidden="true" />
      <span>{pending ? "Wylogowywanie..." : "Wyloguj się"}</span>
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={signOut} className={styles.logoutForm}>
      <SubmitButton />
    </form>
  );
}
