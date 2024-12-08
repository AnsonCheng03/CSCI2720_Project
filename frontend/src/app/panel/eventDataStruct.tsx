import { JSX, useState } from "react";

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
  renderActionColumn,
  actionColumnTitle,
}: {
  eventDataArray: { [key: string]: any }[];
  setEventData: (data: { [key: string]: any }[]) => void;
  renderActionColumn?: (data: { [key: string]: any }) => JSX.Element;
  actionColumnTitle?: string;
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
          {renderActionColumn && actionColumnTitle && (
            <th>{actionColumnTitle}</th>
          )}
        </tr>
      </thead>
      <tbody>
        {eventDataArray.map((data, index) => (
          <tr key={index}>
            {Object.keys(eventKeyMap).map((key: string) => (
              <td key={key}>{data[key as keyof typeof data]}</td>
            ))}
            {renderActionColumn && <td>{renderActionColumn(data)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
