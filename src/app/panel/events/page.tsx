"use client";

import { useState } from "react";
import { useEventContext } from "../EventProvider/context";
import { EventTable } from "../EventProvider/eventDataStruct";
import styles from "./page.module.css";
import { joinEvent, likeEvent } from "@/app/DatabaseProvider/Mutation/Event";

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
  const [likes, setLikes] = useState(totalLikes || 0);
  return (
    <button
      onClick={() => {
        likeEvent(dataID, userID).then((data) => {
          const result = JSON.parse(data);
          if (result.error) {
            console.error(result.message);
            window.alert(result.message);
            return;
          }
          const liked = result["@_likeAction"];
          setIsLiked(liked);
          setLikes(liked ? likes + 1 : likes - 1);
        });
      }}
    >
      {isLiked ? "Unlike" : "Like"}
      {likes > 0 && ` (${likes})`}
    </button>
  );
};

const BookingButton = ({
  dataID,
  userID,
  booked,
}: {
  dataID: string;
  userID: string;
  booked: boolean;
}) => {
  const [isBooked, setIsBooked] = useState(booked);
  return (
    <button
      onClick={() => {
        joinEvent(dataID, userID).then((data) => {
          const result = JSON.parse(data);
          if (result.error) {
            console.error(result.message);
            window.alert(result.message);
            return;
          }
          console.log(result);
          setIsBooked(result["@_joinAction"]);
        });
      }}
    >
      {isBooked ? "Unbook" : "Book"}
    </button>
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
    participants: "Participants",
    quotaLeft: "Quota Left",
    pricee: "Price",
  };

  return (
    <div className={styles.page}>
      <h1>List of Events</h1>
      <EventTable
        mapTable={eventKeyMap}
        eventDataArray={events?.map((event: Record<string, any>) => {
          console.log(event);
          const newEvent = {
            ...event,
            venueid: {
              url: `/panel/location/${event.venueid["@_id"]}`,
              name: event.venueid.venuee,
              ...event.venueid,
            },
            participants:
              event.joinedUsers?.map((user: any) => user.userName).join(", ") ||
              "None",
            quotaLeft: event.quota
              ? event.quota - (event.joinedUsers?.length || 0)
              : "Unlimited",
          };
          return newEvent;
        })}
        setEventData={setEvents}
        actionColumnTitle={"Like and Booking"}
        renderActionColumn={(data: Record<string, any>) => {
          return (
            <div className={styles.actionColumn}>
              <LikeButton
                dataID={data["@_id"]}
                userID={session?.user?.name}
                defaultChecked={
                  data.likedUsers?.filter((user?: { userName?: string }) => {
                    return user?.userName === session?.user?.name;
                  }).length > 0
                }
                totalLikes={data.likedUsers?.length}
              />
              <BookingButton
                dataID={data["@_id"]}
                userID={session?.user?.name}
                booked={
                  data.joinedUsers?.filter((user?: { userName?: string }) => {
                    return user?.userName === session?.user?.name;
                  }).length > 0
                }
              />
            </div>
          );
        }}
      />
    </div>
  );
}
