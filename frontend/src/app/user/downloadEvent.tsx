"use client";

import { useEffect } from "react";
import { useEventContext } from "./context";
import styles from "./page.module.css";
import { XMLParser } from "fast-xml-parser";

export default function DownloadEventPage() {
  const { setEventData } = useEventContext();

  const parser = new XMLParser();

  useEffect(() => {
    fetch(
      "https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fevents.xml"
    )
      .then(async (res) => {
        // parse the XML response
        const data = await res.text();
        const jsonData = parser.parse(data);
        setEventData(jsonData);
      })
      .catch(() => setEventData({}));
  }, []);

  return <div className={styles.page}>Downloading...</div>;
}
