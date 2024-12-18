"use client";

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
import { uploadData } from "@/app/DatabaseProvider/Mutation/Event";

export default function Home() {
  const { venueData, setEventData, setVenueData } = useEventContext();
  const venueIds = venueData?.map((venue: any) => venue["@_id"]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const event: {
      [key: string]: FormDataEntryValue | null | boolean | undefined;
    } = {
      "@_id": formData.get("eventID"),
      titlee: formData.get("eventTitle"),
      venueid: formData.get("locationID"),
      predateE: formData.get("dateTime"),
      desce: formData.get("description"),
      presenterorge: formData.get("presenter"),
      quota: formData.get("quota"),
      pricee: formData.get("price"),
    };

    // Do not override original event object with empty strings
    Object.keys(event).forEach((key) => {
      if (event[key] === "") {
        event[key] = undefined;
      }
    });

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

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2> Add New Event</h2>
      </div>
      <form onSubmit={handleSubmit}>
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
            defaultValue={venueIds?.[0]}
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
      </form>
    </div>
  );
}
