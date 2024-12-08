"use client";

import { Key, useState } from "react";
import { useEventContext } from "./EventProvider/context";
import { EventTable } from "./EventProvider/eventDataStruct";
import styles from "./page.module.css";

export default function Home() {
  const { venueData: rawEventData } = useEventContext();
  const [eventData, setEventData] = useState(rawEventData);

  const eventKeyMap: { [key: string]: string } = {
    "@_id": "ID",
    venueURL: "Location",
    "@_eventCount": "Number of Events",
  };

  const modifiedEventData = eventData?.map((event: Record<string, any>) => {
    event.venueURL = {
      url: `/panel/location/${event["@_id"]}`,
      name: event.venuee,
    };
    return event;
  });

  const eventDataArray = Object.values(
    modifiedEventData as Record<string, any>
  );
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
