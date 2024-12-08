"use client";
import {
  Map,
  APIProvider,
  AdvancedMarker,
  useAdvancedMarkerRef,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import styles from "./page.module.css";
import { useEventContext } from "../EventProvider/context";
import { useState } from "react";
import Link from "next/link";

const Loader = () => (
  <div>
    <p>Loading...</p>
  </div>
);

export default function Home() {
  const { venueData } = useEventContext();

  const markerDetails =
    venueData?.map((venue: any) => ({
      title: venue.venuee,
      url: `/panel/location/${venue["@_id"]}`,
      position: { lat: venue.latitude, lng: venue.longitude },
    })) || [];

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <Map
        style={{ width: "100vw", height: "50vh" }}
        defaultCenter={markerDetails[0]?.position}
        defaultZoom={10}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId={"venueMap"}
      >
        {markerDetails.map((marker, index) => {
          const [markerRef, markerObj] = useAdvancedMarkerRef();
          const [showInfo, setShowInfo] = useState(false);
          return (
            <>
              <AdvancedMarker
                key={index}
                position={marker.position}
                title={marker.title}
                clickable
                ref={markerRef}
                onClick={() => setShowInfo(true)}
              />
              {showInfo && (
                <InfoWindow
                  anchor={markerObj}
                  onCloseClick={() => setShowInfo(false)}
                >
                  <Link
                    style={{
                      color: "black",
                      backgroundColor: "white",
                    }}
                    href={marker.url}
                  >
                    {marker.title}
                  </Link>
                </InfoWindow>
              )}
            </>
          );
        })}
      </Map>
    </APIProvider>
  );
}
