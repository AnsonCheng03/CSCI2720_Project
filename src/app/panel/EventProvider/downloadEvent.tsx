"use client";

import { useEffect } from "react";
import { useEventContext } from "./context";
import styles from "./page.module.css";
import { downloadEventData } from "@/app/DatabaseProvider/Mutation/Event";
import { XMLParser } from "fast-xml-parser";
import { downloadVenueData } from "./downloadVenueData";
import { handleVenueData } from "@/app/DatabaseProvider/Mutation/Venue";

export default function DownloadEventPage() {
  const { setEventData, setVenueData } = useEventContext();

  useEffect(() => {
    downloadEventData().then(async (rawData) => {
      const data = JSON.parse(rawData);
      if (data.error) {
        setEventData([]);
        setVenueData([]);
        return;
      }

      try {
        setEventData(data || []);
        const venue = await downloadVenueData(rawData);
        const handleServerSideVenueDataResponse = JSON.parse(
          await handleVenueData(JSON.parse(venue))
        );
        setVenueData(
          handleServerSideVenueDataResponse.error
            ? JSON.parse(venue)
            : [
                ...JSON.parse(venue),
                ...(handleServerSideVenueDataResponse.downloaded || []),
              ]
        );
      } catch (e) {
        setEventData([]);
        setVenueData([]);
      }
    });
  }, []);

  return <div className={styles.page}>Downloading...</div>;
}
