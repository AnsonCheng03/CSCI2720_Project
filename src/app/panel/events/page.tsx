"use client";

import { useState } from "react";
import { useEventContext } from "../EventProvider/context";
import { EventTable } from "../EventProvider/eventDataStruct";
import styles from "./page.module.css";

export default function Home() {
  const { eventData, setEventData } = useEventContext();
  const [events, setEvents] = useState<any>(eventData);

  const eventKeyMap: { [key: string]: string } = {
    "@_id": "Event ID",
    titlee: "Event Title",
    venueid: "Location ID",
    predateE: "Date/time",
    desce: "Description",
    presenterorge: "Presenter",
    pricee: "Price",
  };

  return (
    <div className={styles.page}>
      <h1>List of Events</h1>
      <EventTable
        mapTable={eventKeyMap}
        eventDataArray={events}
        setEventData={setEvents}
      />
    </div>
  );
}
