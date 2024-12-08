"use client";
import { deleteData, uploadData } from "@/app/DatabaseProvider/database";
import { EventTable } from "../EventProvider/eventDataStruct";
import { downloadData } from "./downloadData";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useEventContext } from "../EventProvider/context";

export default function Home() {
  const { eventData, venueData, setEventData, setVenueData } =
    useEventContext();
  const [events, setEvents] = useState<any[]>([]);

  const venueIds = venueData?.map((venue: any) => venue["@_id"]);

  const handleDownload = async () => {
    const data = (await downloadData(venueIds)) as {
      event: Record<string, any>[];
      venue: Record<string, any>[];
    };
    const filteredData = data.event.filter(
      (event) =>
        !Object.values(eventData as Record<string, any>).find(
          (e) => e.fromDownload && e["@_id"] === event["@_id"]
        )
    );
    setEvents(filteredData as any[]);
  };

  const handleAddToDatabase = (event: any) => {
    uploadData([event]);
    setEventData((prev: Record<string, any>[]) => {
      return [...prev, event];
    });
    setEvents((prev) => {
      return prev.filter((e) => e["@_id"] !== event["@_id"]);
    });
    setVenueData((prev: Record<string, any>[]) => {
      // change the event count for the venue matching the event
      const venueId = event.venueid;
      const venue = prev.find((v) => v["@_id"] == venueId);
      if (venue) {
        return [
          ...prev.filter((v) => v["@_id"] != venueId),
          {
            ...venue,
            "@_eventCount": (venue["@_eventCount"] || 0) + 1,
          },
        ];
      }
      return prev;
    });
  };

  const deleteAll = () => {
    deleteData();
    setEventData([]);
    setEvents([]);
  };

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
      <h1>Download Event</h1>
      <button className={styles.button} onClick={handleDownload}>
        Download
      </button>
      <button className={styles.button} onClick={deleteAll}>
        Delete All
      </button>
      <EventTable
        mapTable={eventKeyMap}
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
