"use client";

import { use, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { Button, Chip, Input } from "@mui/material";
import { FaUserShield } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSessionContext } from "./context";
import styles from "./page.module.css";
import { useAppThemeContext } from "@/app/context/AppThemeContext";

export function LoginBtn() {
  const sessionPromise = useSessionContext();
  const session = use(sessionPromise);
  const { mode, setMode } = useAppThemeContext();

  const searchParams = useSearchParams();
  const errorPrams = searchParams.get("error");
  const [error, setError] = useState(errorPrams);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (session && session.user) {
    return (
      <div>
        <div className={styles.tags}>
          <Chip icon={<FaUserShield />} label={session.user.role} />
          <Chip icon={<FaRegCircleUser />} label={session.user.name} />
        </div>
        <div className={styles.page}>
          <Button
            className={styles.button}
            onClick={() => signOut()}
            variant="outlined"
          >
            Sign out
          </Button>
          <Link href="/panel">
            <Button className={styles.button} variant="outlined">
              Go to panel
            </Button>
          </Link>
          <Button
            className={styles.button}
            onClick={() => {
              console.log(
                "mode",
                window.matchMedia("(prefers-color-scheme: dark)").matches
              );
              document.documentElement.style.setProperty("color-scheme", mode);
              document.documentElement.setAttribute("data-theme", mode);

              setMode(mode === "light" ? "dark" : "light");
              console.log(
                "mode",
                window.matchMedia("(prefers-color-scheme: dark)").matches
              );
            }}
            variant="outlined"
          >
            {mode === "light" ? "Dark" : "Light"} mode
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className={styles.page}>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
        />
        <Input
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setError("");
              signIn("credentials", { username: username, password: password });
            }
          }}
        />
        <Button
          className={styles.button}
          onClick={() => {
            setPassword("");
            setError("");
            signIn("credentials", { username: username, password: password });
          }}
          variant="outlined"
        >
          Sign in
        </Button>
      </div>
      {error && <div className={styles.error}>Error: {error}</div>}
    </div>
  );
}
