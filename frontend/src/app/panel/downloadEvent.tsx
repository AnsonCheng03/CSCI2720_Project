"use client";

import { useEffect } from "react";
import { useEventContext } from "./context";
import styles from "./page.module.css";
import { downloadData } from "@/components/dataBase/database";

export default function DownloadEventPage() {
  const { setEventData } = useEventContext();

  useEffect(() => {
    downloadData().then((data) => {
      setEventData(data);
    });
  }, []);

  return <div className={styles.page}>Downloading...</div>;
}
