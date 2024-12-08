"use client";
import { deleteData, uploadData } from "@/components/dataBase/database";
import { EventTable } from "../eventDataStruct";
import { downloadData } from "./downloadData";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useEventContext } from "../context";

export default function Home() {
  const { eventData, setEventData } = useEventContext();
  const [events, setEvents] = useState<any[]>([]);

  const handleDownload = async () => {
    const data = (await downloadData()) as any[];
    const filteredData = data.filter(
      (event) =>
        !Object.values(eventData as Record<string, any>).find(
          (e) => e.fromDownload && e["@_id"] === event["@_id"]
        )
    );
    setEvents(filteredData as any[]);
  };

  const handleAddToDatabase = (event: any) => {
    uploadData([event]);
    setEventData((prev: Record<string, any>) => {
      return {
        ...prev,
        [event["@_id"]]: event,
      };
    });
    setEvents((prev) => {
      return prev.filter((e) => e["@_id"] !== event["@_id"]);
    });
  };

  const deleteAll = () => {
    deleteData();
    setEventData({});
    setEvents([]);
  };

  return (
    <div className={styles.page}>
      <h1>Download Event</h1>
      <button className={styles.button} onClick={handleDownload}>
        Download
      </button>
      <button className={styles.button} onClick={deleteAll}>
        Delete All
      </button>
      <EventTable
        eventDataArray={events}
        setEventData={setEvents}
        actionColumnTitle={"Add to database"}
        renderActionColumn={(event) => (
          <button
            onClick={() => {
              handleAddToDatabase({
                ...event,
                fromDownload: true,
              });
            }}
          >
            Add
          </button>
        )}
      />
    </div>
  );
}
