"use client";

import { useState } from "react";
import { useEventContext } from "../EventProvider/context";
import { EventTable } from "../EventProvider/eventDataStruct";
import styles from "./page.module.css";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

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

      <FormControl sx={{ width: "30%", minWidth: "300px" }}>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          value={filterSettings.VenuePreference}
          onChange={(e) =>
            setFilterSettings({
              ...filterSettings,
              VenuePreference: e.target.value,
            })
          }
          label="My Preference"
        >
          <MenuItem value="">All</MenuItem>
          {allVenues?.map((venue: string) => (
            <MenuItem key={venue} value={venue}>
              {venue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        label="From Government"
        control={
          <Checkbox
            onChange={(e) =>
              setFilterSettings({
                ...filterSettings,
                fromDownloaded: e.target.checked,
              })
            }
            checked={filterSettings.fromDownloaded}
          />
        }
      />
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
