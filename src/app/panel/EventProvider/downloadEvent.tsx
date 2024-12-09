"use client";

import { useEffect } from "react";
import { useEventContext } from "./context";
import styles from "./page.module.css";
import { downloadEventData } from "@/app/DatabaseProvider/Mutation/Event";
import { downloadVenueData } from "./downloadVenueData";
import { handleVenueData } from "@/app/DatabaseProvider/Mutation/Venue";
import { CircularProgress } from "@mui/material";

export default function DownloadEventPage() {
  const { setEventData, setVenueData } = useEventContext();

  useEffect(() => {
    downloadEventData().then(async (rawData) => {
      const data = JSON.parse(rawData);
      if (data.error) {
        setEventData([]);
        setVenueData([]);
        return;
      }

      try {
        setEventData(data || []);
        const venue = await downloadVenueData();
        const handleServerSideVenueDataResponse = JSON.parse(
          await handleVenueData(JSON.parse(venue))
        );

        const outputVenue = handleServerSideVenueDataResponse.error
          ? JSON.parse(venue)
          : [
              ...(handleServerSideVenueDataResponse.updated || []),
              ...(handleServerSideVenueDataResponse.inserted || []),
              ...(handleServerSideVenueDataResponse.downloaded || []),
            ];
        setVenueData(
          outputVenue.map(
            // get event count for each venue
            (v: any, i: number) => {
              return {
                ...v,
                "@_eventCount": data?.filter((doc: any) => {
                  return (
                    doc["venueid"] == v["@_id"] ||
                    (v["_id"] && doc["venueid"] == v["_id"])
                  );
                }).length,
              };
            }
          )
        );
      } catch (e) {
        setEventData([]);
        setVenueData([]);
      }
    });
  }, []);

  return (
    <div className={styles.page}>
      <CircularProgress />
    </div>
  );
}
