"use client";

import { use } from "react";
import { signIn, signOut } from "next-auth/react";
import { useSessionContext } from "./context";

export function LoginBtn() {
  const sessionPromise = useSessionContext();
  const session = use(sessionPromise);

  if (session && session.user) {
    return (
      <>
        Signed in as {session.user.role} : {session.user.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
