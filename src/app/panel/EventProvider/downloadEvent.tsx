"use client";

import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useEventContext } from "./context";
import styles from "./page.module.css";
import { downloadVenueData } from "./downloadVenueData";
import { downloadEventData } from "@/app/DatabaseProvider/Mutation/Event";
import { handleVenueData } from "@/app/DatabaseProvider/Mutation/Venue";

export default function DownloadEventPage() {
  const { setEventData, setVenueData } = useEventContext();

  useEffect(() => {
    downloadEventData().then(async (rawData) => {
      const data = JSON.parse(rawData);
      console.log(data);
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
            (v: any) => {
              return {
                ...v,
                "@_eventCount": data?.filter((doc: any) => {
                  return (
                    doc["venueid"] && doc["venueid"]["_id"] == v["@_id"] ||
                    (v["_id"] && doc["venueid"] && doc["venueid"]["_id"] == v["_id"])
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
