"use client";
import {
  Map,
  APIProvider,
  AdvancedMarker,
  useAdvancedMarkerRef,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import Link from "next/link";
import { useEventContext } from "../EventProvider/context";
import styles from "./page.module.css";

const Marker = ({ position, title, url }: any) => {
  const [markerRef, markerObj] = useAdvancedMarkerRef();
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div>
      <AdvancedMarker
        position={position}
        title={title}
        clickable
        ref={markerRef}
        onClick={() => setShowInfo(true)}
      />
      {showInfo && (
        <InfoWindow anchor={markerObj} onCloseClick={() => setShowInfo(false)}>
          <Link
            style={{
              color: "black",
              backgroundColor: "white",
            }}
            href={url}
          >
            {title}
          </Link>
        </InfoWindow>
      )}
    </div>
  );
};

export default function Home() {
  const { venueData } = useEventContext();

  const markerDetails =
    venueData?.map((venue: any) => ({
      title: venue.venuee,
      url: `/panel/location/${venue["@_id"]}`,
      position: { lat: venue.latitude, lng: venue.longitude },
    })) || [];

  return (
    <div className={styles.page}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <Map
          style={{ width: "100vw", height: "100vh" }}
          defaultCenter={markerDetails[0]?.position}
          defaultZoom={10}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={"venueMap"}
        >
          {markerDetails.map((marker, index) => {
            return <Marker key={index} {...marker} />;
          })}
        </Map>
      </APIProvider>
    </div>
  );
}
