"use client";

import { createContext, useContext, useState } from "react";
import DownloadEventPage from "./downloadEvent";

const EventContext = createContext<{
  eventData: object[] | null;
  setEventData: any;
  venueData: object[] | null;
  setVenueData: any;
  session: any;
}>({
  eventData: null,
  setEventData: () => {},
  venueData: null,
  setVenueData: () => {},
  session: null,
});

export function useEventContext() {
  if (!EventContext) {
    throw new Error(
      "useEventContext must be used within a EventContext (EventProvider)"
    );
  }
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionContext");
  }
  return context;
}

export default function EventProvider({
  children,
  data,
  session,
}: {
  children: React.ReactNode;
  data: {
    event: object[] | null;
    venue: object[] | null;
  } | null;
  session: any;
}) {
  const [eventData, setEventData] = useState(data?.event || null);
  const [venueData, setVenueData] = useState(data?.venue || null);
  return (
    <EventContext.Provider
      value={{
        eventData,
        setEventData,
        venueData,
        setVenueData,
        session,
      }}
    >
      {eventData === null || venueData === null ? (
        <DownloadEventPage />
      ) : (
        children
      )}
    </EventContext.Provider>
  );
}
