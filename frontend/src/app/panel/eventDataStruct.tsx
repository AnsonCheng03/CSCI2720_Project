import { useState } from "react";

export const eventKeyMap: { [key: string]: string } = {
  "@_id": "ID",
  venuee: "Location",
  "@_eventCount": "Number of Events",
};

export const sortData = (
  eventDataArray: { [key: string]: any }[],
  setEventData: (data: { [key: string]: any }[]) => void,
  key: string,
  direction: number
) => {
  eventDataArray.sort((a, b) => {
    if (a[key] < b[key]) return -1 * direction;
    if (a[key] > b[key]) return 1 * direction;
    return 0;
  });
  setEventData({ ...eventDataArray });
};

export const EventTable = ({
  eventDataArray,
  setEventData,
}: {
  eventDataArray: { [key: string]: any }[];
  setEventData: (data: { [key: string]: any }[]) => void;
}) => {
  const [sortKey, setSortKey] = useState({
    key: "",
    direction: 1,
  });

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(eventKeyMap).map((key: string) => (
            <th
              key={key}
              onClick={() => {
                sortData(eventDataArray, setEventData, key, sortKey.direction);
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
  );
};
