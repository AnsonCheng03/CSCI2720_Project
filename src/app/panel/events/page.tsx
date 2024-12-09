"use client";

import { useState } from "react";
import { useEventContext } from "../EventProvider/context";
import { EventTable } from "../EventProvider/eventDataStruct";
import styles from "./page.module.css";
import { likeEvent } from "@/app/DatabaseProvider/Mutation/Event";

const LikeButton = ({
  dataID,
  userID,
  defaultChecked,
  totalLikes,
}: {
  dataID: string;
  userID: string;
  defaultChecked?: boolean;
  totalLikes?: number;
}) => {
  const [isLiked, setIsLiked] = useState(defaultChecked);
  return (
    <button
      onClick={() => {
        likeEvent(dataID, userID).then((data) => {
          const result = JSON.parse(data);
          if (result.error) {
            console.error(result.message);
            return;
          }
          setIsLiked(false);
        });
      }}
    >
      {isLiked ? "Unlike" : "Like"}
      {totalLikes ? ` (${totalLikes})` : ""}
    </button>
  );
};

const BookingButton = ({
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
        likeEvent(dataID, userID).then((data) => {
          const result = JSON.parse(data);
          if (result.error) {
            console.error(result.message);
            return;
          }
          setIsFavourite(false);
        });
      }}
    />
  );
};

export default function Home() {
  const { session, eventData, setEventData } = useEventContext();
  const [events, setEvents] = useState<any>(eventData);

  const eventKeyMap: { [key: string]: string } = {
    "@_id": "Event ID",
    titlee: "Event Title",
    venueid: "Location Name",
    predateE: "Date/time",
    desce: "Description",
    presenterorge: "Presenter",
    pricee: "Price",
  };

  return (
    <div className={styles.page}>
      <h1>List of Events</h1>
      <EventTable
        mapTable={eventKeyMap}
        eventDataArray={events?.map((event: Record<string, any>) => {
          console.log(event);
          event.venueid.url = `/panel/location/${event.venueid["@_id"]}`;
          event.venueid.name = event.venueid.venuee;
          return event;
        })}
        setEventData={setEvents}
        actionColumnTitle={"Like and Booking"}
        renderActionColumn={(data: Record<string, any>) => {
          return (
            <div className={styles.actionColumn}>
              <LikeButton
                dataID={data["@_id"]}
                userID={session?.user?.name}
                defaultChecked={data.likedUsers?.includes(session?.user?.name)}
                totalLikes={data.likedUsers?.length}
              />
              <BookingButton
                dataID={data["@_id"]}
                userID={session?.user?.name}
                defaultChecked={true}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
