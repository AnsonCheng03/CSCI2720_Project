"use client";

import { Key, useEffect, useState } from "react";
import { getDistance } from "geolib";
import { useEventContext } from "./EventProvider/context";
import { EventTable } from "./EventProvider/eventDataStruct";
import styles from "./page.module.css";
import {
  addFavouriteVenue,
  getFavouriteVenues,
  removeFavouriteVenue,
} from "../DatabaseProvider/Mutation/User";

const AddToFavouriteButton = ({
  dataID,
  userID,
  defaultChecked,
}: {
  dataID: string;
  userID: string;
  defaultChecked?: boolean;
}) => {
  const [isFavourite, setIsFavourite] = useState(defaultChecked);
  return (
    <input
      type="checkbox"
      checked={isFavourite}
      onChange={() => {
        if (isFavourite)
          removeFavouriteVenue(dataID, userID).then((data) => {
            const result = JSON.parse(data);
            if (result.error) {
              console.error(result.message);
              return;
            }
            setIsFavourite(false);
          });
        else
          addFavouriteVenue(dataID, userID).then((data) => {
            const result = JSON.parse(data);
            if (result.error) {
              console.error(result.message);
              return;
            }
            setIsFavourite(true);
          });
      }}
    />
  );
};

export default function Home() {
  const { session, venueData: rawEventData } = useEventContext();
  const [eventData, setEventData] = useState(rawEventData);
  const [filterSettings, setFilterSettings] = useState({
    gpsMeter: 0,
    venue: "",
    category: "",
  });
  const [favoriteData, setFavoriteData] = useState<Object[] | null>(null);

  const eventKeyMap: { [key: string]: string } = {
    "@_id": "ID",
    venueURL: "Location",
    "@_eventCount": "Number of Events",
  };

  const modifiedEventData = eventData?.map((event: Record<string, any>) => {
    event.venueURL = {
      url: `/panel/location/${event["@_id"]}`,
      name: event.venuee,
    };
    return event;
  });

  const eventDataArray = modifiedEventData
    ? Object.values(modifiedEventData as Record<string, any>)
    : [];

  const mostAppearWords = eventDataArray
    .map((event) => event.venuee.split(" "))
    .flat()
    .reduce((acc: Record<string, number>, word: string) => {
      word = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {}) as Record<string, number>;

  const getFavouriteData = async () => {
    const data = JSON.parse(await getFavouriteVenues(session?.user?.name));
    if (data.error) {
      console.error(data.message);
      return;
    }
    const favouriteData = data.map(
      (venue: Record<string, any>) => venue["@_id"]
    );
    setFavoriteData(favouriteData);
  };

  useEffect(() => {
    getFavouriteData();
  }, []);

  return (
    <div className={styles.page}>
      {/* filters 1. gps meter - latitude,longitude(slider)  2. venuee(input) 3.Catagory (contain specific words like 2)  */}
      <h1>Events</h1>
      <input
        type="range"
        min="0"
        max="100"
        value={filterSettings.gpsMeter}
        onChange={(e) =>
          setFilterSettings({
            ...filterSettings,
            gpsMeter: parseInt(e.target.value),
          })
        }
      />
      <input
        type="text"
        placeholder="Search by venue"
        value={filterSettings.venue}
        onChange={(e) =>
          setFilterSettings({ ...filterSettings, venue: e.target.value })
        }
      />
      <select
        value={filterSettings.category}
        onChange={(e) =>
          setFilterSettings({ ...filterSettings, category: e.target.value })
        }
      >
        <option value="">All</option>
        {Object.entries(mostAppearWords)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(
            (word) =>
              word[0] && (
                <option key={word[0]} value={word[0]}>
                  {word[0]}
                </option>
              )
          )}
      </select>

      <EventTable
        mapTable={eventKeyMap}
        eventDataArray={eventDataArray.filter((event) => {
          if (filterSettings.gpsMeter) {
            const gpsMeter = filterSettings.gpsMeter;
            const eventDistance = getDistance(
              {
                latitude: event.latitude,
                longitude: event.longitude,
              },
              {
                latitude: eventDataArray[0].latitude,
                longitude: eventDataArray[0].longitude,
              }
            );
            console.log(eventDistance, gpsMeter * 1000);
            return eventDistance <= gpsMeter * 1000;
          }
          if (filterSettings.venue) {
            return event.venuee
              .toLowerCase()
              .includes(filterSettings.venue.toLowerCase());
          }
          if (filterSettings.category) {
            console.log(filterSettings.category);
            return event.venuee.toLowerCase().includes(filterSettings.category);
          }
          return true;
        })}
        setEventData={setEventData}
        actionColumnTitle={"Add to Favourite"}
        renderActionColumn={
          favoriteData
            ? (data: Record<string, any>) => {
                return (
                  <AddToFavouriteButton
                    dataID={data["@_id"]}
                    userID={session?.user?.name}
                    defaultChecked={favoriteData.includes(data["@_id"])}
                  />
                );
              }
            : () => <>Loading</>
        }
      />
    </div>
  );
}
