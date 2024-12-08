import Link from "next/link";
import { JSX, useState } from "react";

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
  mapTable,
  eventDataArray,
  setEventData,
  renderActionColumn,
  actionColumnTitle,
}: {
  mapTable: { [key: string]: string };
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
          {Object.keys(mapTable).map((key: string) => (
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
              {mapTable[key]}
            </th>
          ))}
          {renderActionColumn && actionColumnTitle && (
            <th>{actionColumnTitle}</th>
          )}
        </tr>
      </thead>
      <tbody>
        {eventDataArray?.map((data, index) => (
          <tr key={index}>
            {Object.keys(mapTable).map((key: string) => {
              const value = data[key as keyof typeof data];
              return (
                <td key={key}>
                  {typeof value === "object" ? (
                    <Link href={value.url}>{value.name}</Link>
                  ) : (
                    value
                  )}
                </td>
              );
            })}
            {renderActionColumn && <td>{renderActionColumn(data)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
