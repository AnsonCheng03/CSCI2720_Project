"use client";

import { createContext, useContext, useState } from "react";
import DownloadEventPage from "./downloadEvent";

const EventContext = createContext<{
  eventData: object | null;
  setEventData: any;
}>({
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
  data: object | null;
}) {
  const [eventData, setEventData] = useState(data);
  return (
    <EventContext.Provider value={{ eventData, setEventData }}>
      {
        // Object.keys(eventData).length === 0
        eventData === null ? <DownloadEventPage /> : children
      }
    </EventContext.Provider>
  );
}
