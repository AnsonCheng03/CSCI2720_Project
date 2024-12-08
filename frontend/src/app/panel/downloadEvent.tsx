"use client";

import { useEffect } from "react";
import { useEventContext } from "./context";
import styles from "./page.module.css";

export default function DownloadEventPage() {
  const { setEventData } = useEventContext();

  useEffect(() => {
    setEventData({});
  }, []);

  return <div className={styles.page}>Downloading...</div>;
}
