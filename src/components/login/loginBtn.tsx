"use client";

import { use } from "react";
import { signIn, signOut } from "next-auth/react";
import { useSessionContext } from "./context";
import Link from "next/link";
import styles from "./page.module.css";

export function LoginBtn() {
  const sessionPromise = useSessionContext();
  const session = use(sessionPromise);

  if (session && session.user) {
    return (
      <div className={styles.page}>
        Signed in as {session.user.role} : {session.user.name} <br />
        <button className={styles.button} onClick={() => signOut()}>
          Sign out
        </button>
        <Link href="/panel" passHref>
          Go to panel
        </Link>
      </div>
    );
  }
  return (
    <>
      <button className={styles.button} onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
}
