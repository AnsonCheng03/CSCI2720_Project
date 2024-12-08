"use client";

import { createContext, useContext, useState } from "react";
import DownloadEventPage from "./downloadEvent";

const EventContext = createContext<{
  eventData: object[] | null;
  setEventData: any;
  venueData: object[] | null;
  setVenueData: any;
}>({
  eventData: null,
  setEventData: () => {},
  venueData: null,
  setVenueData: () => {},
});

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionContext");
  }
  return context;
}

export default function EventProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: {
    event: object[] | null;
    venue: object[] | null;
  } | null;
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
