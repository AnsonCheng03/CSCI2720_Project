"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEventContext } from "../../EventProvider/context";
import styles from "./page.module.css";
import { deleteEvent, editData } from "@/app/DatabaseProvider/Mutation/Event";

export default function Home() {
  const { eventData, venueData, setEventData, setVenueData } =
    useEventContext();
  const eventIds = eventData?.map((event: any) => event["@_id"]);
  const venueIds = venueData?.map((venue: any) => venue["@_id"]);

  const form = useRef(null);

  const handleSubmit = async (type: string) => {
    if (!form.current) return;
    const formData = new FormData(form.current);

    const event: {
      [key: string]: FormDataEntryValue | null | boolean | undefined;
    } = {
      "@_id": formData.get("eventID"),
      titlee: formData.get("eventTitle"),
      venueid: formData.get("locationID"),
      predateE: formData.get("dateTime"),
      desce: formData.get("description"),
      quota: formData.get("quota"),
      presenterorge: formData.get("presenter"),
      pricee: formData.get("price"),
      fromDownload: false,
    };

    let previousVenueId: string | null = null;

    // Do not override original event object with empty strings
    Object.keys(event).forEach((key) => {
      if (event[key] === "") {
        event[key] = undefined;
      }
    });

    if (type === "submit") {
      updateData(event, previousVenueId);
    } else if (type === "delete") {
      deleteData(event, formData.get("eventID"));
    }
  };

  const deleteData = async (event: any, eventId: any) => {
    const deletedEvent = JSON.parse(await deleteEvent(eventId));
    if (deletedEvent.error) {
      console.error(deletedEvent.message);
      window.alert(deletedEvent.message);
      return;
    }

    setEventData((prev: Record<string, any>[]) => {
      return prev.filter((e) => e["@_id"] !== eventId);
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
            "@_eventCount": (venue["@_eventCount"] || 0) - 1,
          },
        ];
      }
      return prev;
    });
  };

  const updateData = async (event: any, previousVenueId: string | null) => {
    const newData = JSON.parse(await editData(event));
    console.log(newData);
    if (newData.error) {
      console.error(newData.message);
      window.alert(newData.message);
      return;
    }

    setEventData((prev: Record<string, any>[]) => {
      const index = prev.findIndex((e) => e["@_id"] == event["@_id"]);
      if (index >= 0) {
        previousVenueId = prev[index].venueid;
        return [...prev.slice(0, index), event, ...prev.slice(index + 1)];
      }
      return [...prev, event];
    });
    setVenueData((prev: Record<string, any>[]) => {
      // change the event count for the venue matching the event
      const venueId = event.venueid;
      const venue = prev.find((v) => v["@_id"] == venueId);
      const previousVenue = prev.find((v) => v["@_id"] == previousVenueId);
      if (venue) {
        return [
          ...prev.filter(
            (v) => v["@_id"] != venueId && v["@_id"] != previousVenueId
          ),
          {
            ...venue,
            "@_eventCount": (venue["@_eventCount"] || 0) + 1,
          },
          {
            ...previousVenue,
            "@_eventCount":
              ((previousVenue && previousVenue["@_eventCount"]) || 0) - 1,
          },
        ];
      }

      return prev;
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Modify Event</h2>
      </div>
      <form ref={form} onSubmit={(e) => e.preventDefault()}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Event ID</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Event ID"
            name="eventID"
          >
            {eventIds?.map((eventId: any) => (
              <MenuItem key={eventId} value={eventId}>
                {eventId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="standard-required"
          label="Event Title"
          name="eventTitle"
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Location ID</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Location ID"
            name="locationID"
          >
            {venueIds?.map((venueId: any) => (
              <MenuItem key={venueId} value={venueId}>
                {venueId}
              </MenuItem>
            ))}
          </Select>
          <p>
            Input: ID of location. The ID should be corresponding to the IDs in
            <Link href="/panel"> location list</Link>.
          </p>
        </FormControl>
        <TextField
          
          id="standard-required"
          label="Date/Time"
          name="dateTime"
          fullWidth
        />
        <TextField
          id="standard-required"
          label="Description"
          name="description"
          fullWidth
        />
        <TextField
          id="standard-required"
          label="Presenter"
          name="presenter"
          fullWidth
        />
        <TextField
          id="standard-required"
          label="Price"
          name="price"
          fullWidth
        />
        <TextField
          id="standard-required"
          label="Quota"
          name="quota"
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          onClick={() => handleSubmit("submit")}
        >
          Submit
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={() => handleSubmit("delete")}
        >
          Delete
        </Button>
      </form>
    </div>
  );
}
