"use client";

import { Key } from "react";
import { useEventContext } from "./context";
import styles from "./page.module.css";

export default function Home() {
  const { eventData } = useEventContext();

  // venuec	venuee	latitude	longitude	@_id	@_eventCount
  const eventKeyMap: { [key: string]: string } = {
    "@_id": "ID",
    venuee: "Location",
    "@_eventCount": "Number of Events",
  };
  const eventDataArray = Object.values(eventData);

  return (
    <div className={styles.page}>
      {/*turn it as a table  */}
      <table>
        <thead>
          <tr>
            {Object.keys(eventKeyMap).map((key: string) => (
              <th key={key}>{eventKeyMap[key]}</th>
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
