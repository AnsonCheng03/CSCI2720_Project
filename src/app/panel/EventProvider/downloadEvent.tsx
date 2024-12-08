"use client";

import { useEffect } from "react";
import { useEventContext } from "./context";
import styles from "./page.module.css";
import { downloadEventData } from "@/app/DatabaseProvider/database";
import { XMLParser } from "fast-xml-parser";
import { downloadVenueData } from "./downloadVenueData";

export default function DownloadEventPage() {
  const { setEventData, setVenueData } = useEventContext();

  useEffect(() => {
    downloadEventData().then(async (rawData) => {
      try {
        const venue = await downloadVenueData(rawData);
        setEventData(JSON.parse(rawData));
        setVenueData(JSON.parse(venue));
      } catch (e) {
        setEventData([]);
        setVenueData([]);
      }
    });
  }, []);

  return <div className={styles.page}>Downloading...</div>;
}
