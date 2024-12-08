"use client";

import { createContext, useContext, useState } from "react";
import DownloadEventPage from "./downloadEvent";

const EventContext = createContext<{ eventData: object; setEventData: any }>({
  eventData: {},
  setEventData: () => {},
});

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
  const [eventData, setEventData] = useState(data);
  return (
    <EventContext.Provider value={{ eventData, setEventData }}>
      {Object.keys(eventData).length === 0 ? <DownloadEventPage /> : children}
    </EventContext.Provider>
  );
}
