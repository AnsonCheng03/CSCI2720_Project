"use client";

import { use, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { Input } from "@mui/material";
import { useSessionContext } from "./context";
import Link from "next/link";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";

export function LoginBtn() {
  const sessionPromise = useSessionContext();
  const session = use(sessionPromise);

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    <div>
      <div className={styles.page}>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={() =>
            signIn("credentials", { username: username, password: password })
          }
        >
          Sign in
        </button>
      </div>
      {error && <div className={styles.error}>Error: {error}</div>}
    </div>
  );
}
