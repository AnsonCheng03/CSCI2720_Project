"use client";

import { useState } from "react";
import { useEventContext } from "../EventProvider/context";
import { EventTable } from "../EventProvider/eventDataStruct";
import styles from "./page.module.css";

export default function Home() {
  const { eventData } = useEventContext();
  const [events, setEvents] = useState<any>(eventData);
  const [filterSettings, setFilterSettings] = useState({
    VenuePreference: "",
    fromDownloaded: false,
  });

  const eventKeyMap: { [key: string]: string } = {
    "@_id": "Event ID",
    titlee: "Event Title",
    venueid: "Location Name",
    predateE: "Date/time",
    desce: "Description",
    presenterorge: "Presenter",
    participants: "Participants",
    quotaLeft: "Quota Left",
    pricee: "Price",
  };

  const allVenues = eventData
    ?.map((event: Record<string, any>) => event.venueid?.venuee)
    .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <div className={styles.page}>
      <h1>Suggestions</h1>
      <label>
        My Preference:
        <select
          onChange={(e) =>
            setFilterSettings({
              ...filterSettings,
              VenuePreference: e.target.value,
            })
          }
          value={filterSettings.VenuePreference}
        >
          <option value="">All</option>
          {allVenues?.map((venue: string) => (
            <option key={venue} value={venue}>
              {venue}
            </option>
          ))}
        </select>
      </label>
      <label>
        From Government:
        <input
          type="checkbox"
          onChange={(e) =>
            setFilterSettings({
              ...filterSettings,
              fromDownloaded: e.target.checked,
            })
          }
          checked={filterSettings.fromDownloaded}
        />
      </label>
      <EventTable
        mapTable={eventKeyMap}
        eventDataArray={events
          ?.sort(() => Math.random() - 0.5)
          .filter((event: Record<string, any>) => {
            // console.log(event, event?.venueid?.venuee, event?.fromDownload);
            if (
              filterSettings.VenuePreference &&
              event.venueid?.venuee !== filterSettings.VenuePreference
            )
              return false;
            if (filterSettings.fromDownloaded && event.fromDownload === false)
              return false;
            return true;
          })
          .slice(0, 2)
          .map((event: Record<string, any>) => {
            console.log(event);
            const newEvent = {
              ...event,
              venueid: {
                url: `/panel/location/${event.venueid["@_id"]}`,
                name: event.venueid.venuee,
                ...event.venueid,
              },
              participants:
                event.joinedUsers
                  ?.map((user: any) => user.userName)
                  .join(", ") || "None",
              quotaLeft: event.quota
                ? event.quota - (event.joinedUsers?.length || 0)
                : "Unlimited",
            };
            return newEvent;
          })}
        setEventData={setEvents}
      />
    </div>
  );
}
