"use client";

import { Key, useState } from "react";
import { useEventContext } from "./EventProvider/context";
import { EventTable } from "./EventProvider/eventDataStruct";
import styles from "./page.module.css";

const latlngConverter = (lat: number, lng: number) => {
  // convert lat and lng to gps meter
};

export default function Home() {
  const { venueData: rawEventData } = useEventContext();
  const [eventData, setEventData] = useState(rawEventData);

  const [filterSettings, setFilterSettings] = useState({
    gpsMeter: 0,
    venue: "",
    category: "",
  });

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

  // console.log(eventDataArray);
  return (
    <div className={styles.page}>
      {/* filters 1. gps meter - latitude,longitude(slider)  2. venuee(input) 3.Catagory (contain specific words like 2)  */}
      <h1>Events</h1>
      <input type="range" min="0" max="100" />
      <input type="text" placeholder="Search by venue" />
      <input type="select" placeholder="Category" />
      <EventTable
        mapTable={eventKeyMap}
        eventDataArray={eventDataArray}
        setEventData={setEventData}
      />
    </div>
  );
}
