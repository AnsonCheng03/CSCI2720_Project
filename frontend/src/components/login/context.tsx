"use client";

import { createContext, useContext } from "react";

export const SessionContext = createContext<Promise<any> | null>(null);

export function LoginBtnProvider({
  children,
  sessionPromise,
}: {
  children: React.ReactNode;
  sessionPromise: Promise<any>;
}) {
  return (
    <SessionContext.Provider value={sessionPromise}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionContext");
  }
  return context;
}
