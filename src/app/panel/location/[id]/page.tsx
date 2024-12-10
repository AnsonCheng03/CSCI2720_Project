"use client";
import {
  APIProvider,
  useAdvancedMarkerRef,
  AdvancedMarker,
  InfoWindow,
  Map,
} from "@vis.gl/react-google-maps";
import { Divider, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useEventContext } from "../../EventProvider/context";
import styles from "./page.module.css";
import { createComment } from "@/app/DatabaseProvider/Mutation/Comment";
import {
  addCommentToVenue,
  getVenueComments,
} from "@/app/DatabaseProvider/Mutation/Venue";

const Marker = ({ position, title, url }: any) => {
  const [markerRef, markerObj] = useAdvancedMarkerRef();
  return (
    <div>
      <AdvancedMarker
        position={position}
        title={title}
        clickable
        ref={markerRef}
      />
      <InfoWindow anchor={markerObj}>
        <a
          style={{
            color: "black",
            backgroundColor: "white",
          }}
          href={url}
        >
          {title}
        </a>
      </InfoWindow>
    </div>
  );
};

export default function Page({ params }: { params: { id: string } }) {
  // return <p>Post: {params.id}</p>;

  const { venueData, session } = useEventContext();

  const [comments, setComments] = useState<
    { content: string; userName: string }[] | null
  >(null);

  const selectedVenue = venueData?.filter(
    (venue: any) => venue["@_id"] == params.id
  );

  useEffect(() => {
    if (!params.id || !selectedVenue || selectedVenue.length == 0) return;
    getComments();
  }, []);

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
    if (response.error) {
      console.error(response.message);
      window.alert("Error submitting comment");
      return;
    }

    setComments((prev: any) => {
      if (!prev) {
        return [comment];
      }
      return [...prev, comment];
    });
  };

  const getComments = async () => {
    const response = JSON.parse(await getVenueComments(params.id));
    if (response.error) {
      console.error(response.message);
      window.alert("Error getting comments");
      setComments(null);
      return;
    }
    setComments(response);
  };

  return (
    <div className={styles.page}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <Map
          className={styles.map}
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
      {/* // Location Details */}
      <div className={styles.locationDetails}>
        <div>
          {selectedVenue?.map((venue: any, index: number) => {
            return (
              <div key={index}>
                <h3>{venue.venuee}</h3>
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
        <Divider flexItem />
        <div>
          <h3>Comments</h3>
          {comments ? (
            comments.map((comment, index) => {
              return (
                <div key={index}>
                  <h3>{comment.userName}</h3>
                  <p>{comment.content}</p>
                </div>
              );
            })
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <Divider flexItem />

        <div>
          <h3>Add Comment</h3>
          <form
            onSubmit={(e) => {
              submitComment(e);
            }}
          >
            <TextField
              placeholder="Comment"
              name="comment"
              multiline
              fullWidth
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
