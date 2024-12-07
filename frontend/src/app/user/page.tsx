"use client";

import { useEventContext } from "./context";
import styles from "./page.module.css";

export default function Home() {
  const event = useEventContext();
  return (
    <div className={styles.page}>
      aaa User
      <pre>{JSON.stringify(event, null, 2)}</pre>
    </div>
  );
}
