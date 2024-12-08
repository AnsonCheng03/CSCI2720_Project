"use client";

import { useEventContext } from "../../context";
import styles from "./page.module.css";

export default function Home() {
  const { eventData, venueData, setEventData } = useEventContext();
  const [events, setEvents] = useState<any[]>([]);

  return <div className={styles.page}>aaa</div>;
}
