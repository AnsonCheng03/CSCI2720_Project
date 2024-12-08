"use client";

import { useEffect } from "react";
import { useEventContext } from "./context";
import styles from "./page.module.css";
import { downloadEventData } from "@/components/dataBase/database";
import { XMLParser } from "fast-xml-parser";

export default function DownloadEventPage() {
  const { setEventData, setVenueData } = useEventContext();

  useEffect(() => {
    downloadEventData().then(async (data) => {
      try {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
        });

        // get multiple XML files
        const urls: { [key: string]: string } = {
          venue:
            "https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fvenues.xml",
        };
        const venueData = await Promise.all(
          Object.entries(urls).map(([key, url]) =>
            fetch(url)
              .then((res) => res.text())
              .then((data) => {
                const parsed = parser.parse(data);
                return { [key]: parsed };
              })
          )
        );

        const output = {
          venue: {},
        } as {
          venue: {
            "@_id": string;
            "@_eventCount": number;
            latitude: number;
            longitude: number;
          }[];
        };
        const [venue] = venueData;

        if (venue) {
          const venues = venue?.venue?.venues?.venue;
          output.venue = Array.isArray(venues)
            ? venues
                .filter((v) => v["latitude"] && v["longitude"])
                .map(
                  // get event count for each venue
                  (v) => {
                    return {
                      ...v,
                      "@_eventCount": data?.filter((doc) => {
                        console.log(doc["venueid"], v["@_id"]);
                        return doc["venueid"] == v["@_id"];
                      }).length,
                    };
                  }
                )
            : [];
        }

        setEventData(data);
        setVenueData(output.venue);
      } catch (e) {
        setEventData({});
        setVenueData({});
      }
    });
  }, []);

  return <div className={styles.page}>Downloading...</div>;
}
