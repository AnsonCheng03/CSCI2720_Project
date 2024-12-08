"use client";

import { Key, useState } from "react";
import { useEventContext } from "./context";
import { EventTable } from "./eventDataStruct";
import styles from "./page.module.css";

export default function Home() {
  const { venueData: rawEventData } = useEventContext();
  const [eventData, setEventData] = useState(rawEventData);

  const eventKeyMap: { [key: string]: string } = {
    "@_id": "ID",
    venuee: "Location",
    "@_eventCount": "Number of Events",
  };

  const eventDataArray = Object.values(eventData as Record<string, any>);
  return (
    <div className={styles.page}>
      <EventTable
        mapTable={eventKeyMap}
        eventDataArray={eventDataArray}
        setEventData={setEventData}
      />
    </div>
  );
}
