"use client";

import { useEventContext } from "./context";
import styles from "./page.module.css";

export default function Home() {
  const { eventData } = useEventContext();
  return (
    <div className={styles.page}>
      <pre>{JSON.stringify(eventData, null, 2)}</pre>
    </div>
  );
}
