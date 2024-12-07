"use client";

import { createContext, useContext } from "react";

const EventContext = createContext<object | null>(null);

export function useEventContext() {
  return useContext(EventContext);
}

export default function EventProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: object;
}) {
  return <EventContext.Provider value={data}>{children}</EventContext.Provider>;
}
