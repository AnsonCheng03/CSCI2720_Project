"use client";
import { useState } from "react";
import { Button } from "@mui/material";
import { useEventContext } from "../EventProvider/context";
import { EventList } from "../EventProvider/eventList";
import { downloadData } from "./downloadData";
import styles from "./page.module.css";
import { deleteData, uploadData } from "@/app/DatabaseProvider/Mutation/Event";

export default function Home() {
  const { eventData, venueData, setEventData, setVenueData } =
    useEventContext();
  const [events, setEvents] = useState<any[]>([]);

  const venueIds = venueData?.map((venue: any) => venue["@_id"]);

  const handleDownload = async () => {
    if (!venueIds) {
      console.error("Venue IDs are undefined");
      return;
    }
    const data = JSON.parse(await downloadData(venueIds)) as {
      event: Record<string, any>[];
      venue: Record<string, any>[];
    };
    const filteredData = data.event.filter(
      (event) =>
        !Object.values(eventData as Record<string, any>).find(
          (e) => e["@_id"] === event["@_id"]
        )
    );
    setEvents(filteredData as any[]);
  };

  const handleAddToDatabase = async (event: any) => {
    const newEvent = JSON.parse(await uploadData(event));
    if (newEvent.error) {
      console.error(newEvent.message);
      window.alert(newEvent.message);
      return;
    }

    console.log("Event added to database", newEvent);
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

  const deleteAll = async () => {
    const returnData = JSON.parse(await deleteData());
    if (returnData.error) {
      console.error(returnData.message);
      window.alert(returnData.message);
      return;
    }

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
      <Button onClick={handleDownload} variant="contained">
        Download
      </Button>
      <Button onClick={deleteAll} variant="contained" color="error">
        Delete All
      </Button>
      <EventList
        mapTable={eventKeyMap}
        eventDataArray={events}
        setEventData={setEvents}
        actionColumnTitle={"Add to database"}
        renderActionColumn={(event) => (
          <Button
            variant="contained"
            onClick={() => {
              handleAddToDatabase({
                ...event,
                fromDownload: true,
              });
            }}
          >
            Add
          </Button>
        )}
      />
    </div>
  );
}
