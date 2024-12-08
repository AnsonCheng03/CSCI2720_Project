"use client";

import Link from "next/link";
import { useEventContext } from "../../EventProvider/context";
import styles from "./page.module.css";
import { uploadData } from "@/app/DatabaseProvider/Mutation/Event";

export default function Home() {
  const { venueData, setEventData, setVenueData } = useEventContext();
  const venueIds = venueData?.map((venue: any) => venue["@_id"]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const event = {
      "@_id": formData.get("eventID"),
      titlee: formData.get("eventTitle"),
      venueid: formData.get("locationID"),
      predateE: formData.get("dateTime"),
      desce: formData.get("description"),
      presenterorge: formData.get("presenter"),
      pricee: formData.get("price"),
    };

    uploadData([event]);
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
      <form onSubmit={handleSubmit}>
        <label>
          Event ID:
          <input type="text" name="eventID" />
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
