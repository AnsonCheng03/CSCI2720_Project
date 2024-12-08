"use client";
import { EventTable } from "../eventDataStruct";
import { downloadData } from "./downloadData";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);

  const handleDownload = async () => {
    const data = (await downloadData()) as any[];
    setEvents(data);
  };

  return (
    <div className={styles.page}>
      <h1>Download Event</h1>
      <button className={styles.button} onClick={handleDownload}>
        Download
      </button>
      <EventTable
        eventDataArray={events}
        setEventData={setEvents}
        actionColumnTitle={"Add to database"}
        renderActionColumn={(event) => (
          <button
            onClick={() => {
              console.log("Add to database", event);
            }}
          >
            Add
          </button>
        )}
      />
    </div>
  );
}
