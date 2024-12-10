"use client";

import { useEffect, useState } from "react";
import { useEventContext } from "../EventProvider/context";
import { EventTable } from "../EventProvider/eventDataStruct";
import styles from "./page.module.css";
import {
  addFavouriteVenue,
  getFavouriteVenues,
  removeFavouriteVenue,
} from "@/app/DatabaseProvider/Mutation/User";

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
              window.alert(result.message);
              return;
            }
            setIsFavourite(false);
          });
        else
          addFavouriteVenue(dataID, userID).then((data) => {
            const result = JSON.parse(data);
            if (result.error) {
              console.error(result.message);
              window.alert(result.message);
              return;
            }
            setIsFavourite(true);
          });
      }}
    />
  );
};

export default function Home() {
  const { session } = useEventContext();
  const [favoriteData, setFavoriteData] = useState<Object[] | null>(null);

  const eventKeyMap: { [key: string]: string } = {
    "@_id": "ID",
    venueURL: "Location",
    "@_eventCount": "Number of Events",
  };

  const getFavouriteData = async () => {
    const data = JSON.parse(await getFavouriteVenues(session?.user?.name));
    if (data.error) {
      console.error(data.message);
      window.alert(data.message);
      return;
    }

    const modifiedEventData = data?.map((event: Record<string, any>) => {
      event.venueURL = {
        url: `/panel/location/${event["@_id"]}`,
        name: event.venuee,
      };
      return event;
    });

    const eventDataArray = modifiedEventData
      ? Object.values(modifiedEventData as Record<string, any>)
      : [];

    setFavoriteData(eventDataArray);
  };

  useEffect(() => {
    getFavouriteData();
  }, []);

  return (
    <div className={styles.page}>
      {favoriteData ? (
        <EventTable
          mapTable={eventKeyMap}
          eventDataArray={favoriteData}
          setEventData={setFavoriteData}
          actionColumnTitle={"Add to Favourite"}
          renderActionColumn={(data: Record<string, any>) => {
            return (
              <AddToFavouriteButton
                dataID={data["@_id"]}
                userID={session?.user?.name}
                defaultChecked={true}
              />
            );
          }}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
