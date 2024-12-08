"use client";

import { Key, useState } from "react";
import { useEventContext } from "./context";
import { EventTable } from "./eventDataStruct";
import styles from "./page.module.css";

export default function Home() {
  const { eventData: rawEventData } = useEventContext();
  const [eventData, setEventData] = useState(rawEventData);

  const eventDataArray = Object.values(eventData);

  return (
    <div className={styles.page}>
      <EventTable eventDataArray={eventDataArray} setEventData={setEventData} />
    </div>
  );
}
