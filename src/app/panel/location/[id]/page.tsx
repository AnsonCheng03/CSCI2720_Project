"use client";
import {
  APIProvider,
  useAdvancedMarkerRef,
  AdvancedMarker,
  InfoWindow,
  Map,
} from "@vis.gl/react-google-maps";
import { useRouter } from "next/compat/router";
import { useState } from "react";
import { useEventContext } from "../../context";

export default function Page({ params }: { params: { id: string } }) {
  // return <p>Post: {params.id}</p>;

  const { venueData } = useEventContext();

  const selectedVenue = venueData?.filter(
    (venue: any) => venue["@_id"] == params.id
  );

  if (selectedVenue?.length == 0) {
    return <p>Location Not found</p>;
  }

  const markerDetails =
    selectedVenue?.map((venue: any) => ({
      title: venue.venuee,
      url: `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`,
      position: { lat: venue.latitude, lng: venue.longitude },
    })) || [];

  return (
    <>
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
            return (
              <>
                <AdvancedMarker
                  key={index}
                  position={marker.position}
                  title={marker.title}
                  clickable
                  ref={markerRef}
                />
                <InfoWindow anchor={markerObj}>
                  <a
                    style={{
                      color: "black",
                      backgroundColor: "white",
                    }}
                  >
                    {marker.title}
                  </a>
                </InfoWindow>
              </>
            );
          })}
        </Map>
      </APIProvider>
      {/* // Location Details */}
      <div>
        {selectedVenue?.map((venue: any, index: number) => {
          return (
            <div key={index}>
              <h2>{venue.venuee}</h2>
              {Object.entries(venue).map(([key, value]: [string, any]) => {
                return (
                  <div key={key}>
                    <b>{key}</b>: {value}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* // Show Comments */}
      <div>
        <h2>Comments</h2>
        <p>Comments will be shown here</p>
      </div>
      {/* // Add Comment */}
      <div>
        <h2>Add Comment</h2>
        <form>
          <textarea placeholder="Comment" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
