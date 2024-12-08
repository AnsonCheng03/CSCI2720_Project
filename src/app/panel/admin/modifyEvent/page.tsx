"use client";

import Link from "next/link";
import { useEventContext } from "../../EventProvider/context";
import styles from "./page.module.css";
import { deleteEvent, editData } from "@/app/DatabaseProvider/Mutation/Event";
import { useRef } from "react";

export default function Home() {
  const { eventData, venueData, setEventData, setVenueData } =
    useEventContext();
  const eventIds = eventData?.map((event: any) => event["@_id"]);
  const venueIds = venueData?.map((venue: any) => venue["@_id"]);

  const form = useRef(null);

  const handleSubmit = async (type: string) => {
    if (!form.current) return;
    const formData = new FormData(form.current);

    const event = {
      "@_id": formData.get("eventID"),
      titlee: formData.get("eventTitle"),
      venueid: formData.get("locationID"),
      predateE: formData.get("dateTime"),
      desce: formData.get("description"),
      presenterorge: formData.get("presenter"),
      pricee: formData.get("price"),
    };

    let previousVenueId: string | null = null;

    if (type === "submit") {
      updateData(event, previousVenueId);
    } else if (type === "delete") {
      deleteData(event, formData.get("eventID"));
    }
  };

  const deleteData = async (event: any, eventId: any) => {
    deleteEvent(eventId);
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
    editData(event);
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
      <form ref={form} onSubmit={(e) => e.preventDefault()}>
        <label>
          Event ID:
          <select name="eventID">
            {eventIds?.map((eventId: any) => (
              <option key={eventId} value={eventId}>
                {eventId}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Event title:
          <input type="text" name="eventTitle" />
        </label>
        <br />
        <label>
          Location ID:
          <select name="locationID">
            {venueIds?.map((venueId: any) => (
              <option key={venueId} value={venueId}>
                {venueId}
              </option>
            ))}
          </select>
        </label>
        <br />
        <p>
          Input: ID of location. The ID should be corresponding to the IDs in
          <Link href="/panel"> location list</Link>.
        </p>
        <label>
          Date/time:
          <input type="text" name="dateTime" />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="description" />
        </label>
        <br />
        <label>
          Presenter:
          <input type="text" name="presenter" />
        </label>
        <br />
        <label>
          Price:
          <input type="text" name="price" />
        </label>
        <br />
        <button
          type="submit"
          name="submit"
          value="submit"
          onClick={() => handleSubmit("submit")}
        >
          Submit
        </button>
        <button
          type="button"
          name="submit"
          value="delete"
          onClick={() => handleSubmit("delete")}
        >
          Delete
        </button>
      </form>
    </div>
  );
}
