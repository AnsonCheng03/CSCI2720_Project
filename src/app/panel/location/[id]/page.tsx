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
import { useEventContext } from "../../EventProvider/context";
import { createComment } from "@/app/DatabaseProvider/Mutation/Comment";
import { addCommentToVenue } from "@/app/DatabaseProvider/Mutation/Venue";

export default function Page({ params }: { params: { id: string } }) {
  // return <p>Post: {params.id}</p>;

  const { venueData, session } = useEventContext();

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

  const submitComment = async (e: any) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const comment = {
      content: form.get("comment"),
      userName: session?.user?.name,
    };

    const result = JSON.parse(await createComment(comment));
    if (result.error || !result) {
      console.error(result.message);
      window.alert("Error submitting comment");
      return;
    }

    const commentID = result._id;

    const response = JSON.parse(await addCommentToVenue(commentID, params.id));
    console.log(response);
    if (response.error) {
      console.error(response.message);
      window.alert("Error submitting comment");
      return;
    }
    console.log(response);
  };

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
              <div key={index}>
                <AdvancedMarker
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
              </div>
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
                    {typeof value === "string" && (
                      <>
                        <b>{key}</b>: {value}
                      </>
                    )}
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
        <form
          onSubmit={(e) => {
            submitComment(e);
          }}
        >
          <textarea placeholder="Comment" name="comment" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
