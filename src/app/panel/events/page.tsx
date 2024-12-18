"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import { useEventContext } from "../EventProvider/context";
import { EventList } from "../EventProvider/eventList";
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
    <Button
      variant="contained"
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
      {`${isLiked ? "Unlike" : "Like"} (${likes})`}
    </Button>
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
    <Button
      variant="contained"
      onClick={() => {
        joinEvent(dataID, userID).then((data) => {
          const result = JSON.parse(data);
          if (result.error) {
            console.error(result.message);
            window.alert(result.message);
            return;
          }
          setIsBooked(result["@_joinAction"]);
        });
      }}
    >
      {isBooked ? "Unbook" : "Book"}
    </Button>
  );
};

export default function Home() {
  const { session, eventData } = useEventContext();
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
      <EventList
        mapTable={eventKeyMap}
        eventDataArray={events?.map((event: Record<string, any>) => {
          const newEvent = {
            ...event,
            venueid: {
              url:
                event.venueid && event.venueid["@_id"]
                  ? `/panel/location/${event.venueid["@_id"]}`
                  : "",
              name: event.venueid && event.venueid.venuee,
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
