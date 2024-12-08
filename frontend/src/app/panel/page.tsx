"use client";

import { Key, useState } from "react";
import { useEventContext } from "./context";
import styles from "./page.module.css";

export default function Home() {
  const { eventData: rawEventData } = useEventContext();
  const [eventData, setEventData] = useState(rawEventData);
  const [sortKey, setSortKey] = useState({
    key: "",
    direction: 1,
  });

  // venuec	venuee	latitude	longitude	@_id	@_eventCount
  const eventKeyMap: { [key: string]: string } = {
    "@_id": "ID",
    venuee: "Location",
    "@_eventCount": "Number of Events",
  };
  const eventDataArray = Object.values(eventData);

  const sortData = (key: string, direction: number) => {
    eventDataArray.sort((a, b) => {
      if (a[key] < b[key]) return -1 * direction;
      if (a[key] > b[key]) return 1 * direction;
      return 0;
    });
    setEventData({ ...eventDataArray });
  };

  return (
    <div className={styles.page}>
      <table>
        <thead>
          <tr>
            {Object.keys(eventKeyMap).map((key: string) => (
              <th
                key={key}
                onClick={() => {
                  sortData(key, sortKey.direction);
                  setSortKey({
                    key,
                    direction: sortKey.direction * -1,
                  });
                }}
              >
                {eventKeyMap[key]}
              </th>
            ))}
            <th>Add to Favorite</th>
          </tr>
        </thead>
        <tbody>
          {eventDataArray.map((data) => (
            <tr key={data.id}>
              {Object.keys(eventKeyMap).map((key: string) => (
                <td key={key}>{data[key as keyof typeof data]}</td>
              ))}
              <td>
                <input
                  type="checkbox"
                  id={data["@_id"]}
                  name={data["@_id"]}
                  value={data["@_id"]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
