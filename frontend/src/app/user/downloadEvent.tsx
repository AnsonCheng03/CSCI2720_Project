"use client";

import { useEffect } from "react";
import { useEventContext } from "./context";
import styles from "./page.module.css";
import { XMLParser } from "fast-xml-parser";

export default function DownloadEventPage() {
  const { setEventData } = useEventContext();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  useEffect(() => {
    // get multiple XML files
    const urls: { [key: string]: string } = {
      event:
        "https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fevents.xml",
      venue:
        "https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fvenues.xml",
    };
    Promise.all(
      Object.entries(urls).map(([key, url]) =>
        fetch(url)
          .then((res) => res.text())
          .then((data) => {
            const parsed = parser.parse(data);
            return { [key]: parsed };
          })
      )
    )
      .then((data) => {
        const output = {
          event: {},
          venue: {},
        } as {
          event: { id: string; venueid: string }[];
          venue: {
            "@_id": string;
            "@_eventCount": number;
            latitude: number;
            longitude: number;
          }[];
        };
        const [event, venue] = data;

        if (event) {
          const events = event?.event?.events?.event;
          output.event = Array.isArray(events)
            ? events.map((e) => ({
                id: e["@_id"],
                venueid: e["venueid"],
              }))
            : [];
        }

        if (venue) {
          const venues = venue?.venue?.venues?.venue;
          output.venue = Array.isArray(venues)
            ? venues.filter((v) => v["latitude"] && v["longitude"])
            : [];
        }

        return output;
      })
      .then((output) => {
        const venueCount = output.event.reduce(
          (acc: { [key: string]: number }, e) => {
            acc[e.venueid] = (acc[e.venueid] || 0) + 1;
            return acc;
          },
          {}
        );

        output.venue = output.venue.map((v) => ({
          ...v,
          "@_eventCount": venueCount[v["@_id"]] || 0,
        }));
        setEventData(output.venue);
      })
      .catch(() => setEventData({}));
  }, []);

  return <div className={styles.page}>Downloading...</div>;
}
