"use client";

import { useEffect, useState } from "react";
import { getDistance } from "geolib";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import {
  addFavouriteVenue,
  getFavouriteVenues,
  removeFavouriteVenue,
} from "../DatabaseProvider/Mutation/User";
import { useEventContext } from "./EventProvider/context";
import { EventTable } from "./EventProvider/eventTable";
import styles from "./page.module.css";

const AddToFavouriteButton = ({
  dataID,
  userID,
  defaultChecked,
}: {
  dataID: string;
  userID: string;
  defaultChecked?: boolean;
}) => {
  const [isFavourite, setIsFavourite] = useState(defaultChecked);
  return isFavourite ? (
    <FaHeart
      onClick={() => {
        removeFavouriteVenue(dataID, userID).then((data) => {
          const result = JSON.parse(data);
          if (result.error) {
            console.error(result.message);
            window.alert(result.message);
            return;
          }
          setIsFavourite(false);
        });
      }}
    />
  ) : (
    <FaRegHeart
      onClick={() => {
        addFavouriteVenue(dataID, userID).then((data) => {
          const result = JSON.parse(data);
          if (result.error) {
            console.error(result.message);
            window.alert(result.message);
            return;
          }
          setIsFavourite(true);
        });
      }}
    />
  );
};

export default function Home() {
  const { session, venueData: rawEventData } = useEventContext();
  const [eventData, setEventData] = useState(rawEventData);
  const [filterSettings, setFilterSettings] = useState({
    gpsMeter: 0,
    venue: "",
    category: "",
  });
  const [favoriteData, setFavoriteData] = useState<Object[] | null>(null);

  const eventKeyMap: { [key: string]: string } = {
    "@_id": "ID",
    venueURL: "Location",
    "@_eventCount": "Number of Events",
  };

  const modifiedEventData = eventData?.map((event: Record<string, any>) => {
    event.venueURL = {
      url: `/panel/location/${event["@_id"]}`,
      name: event.venuee,
    };
    return event;
  });

  const eventDataArray = modifiedEventData
    ? Object.values(modifiedEventData as Record<string, any>)
    : [];

  const mostAppearWords = eventDataArray
    .map((event) => event.venuee?.split(" "))
    .flat()
    .reduce((acc: Record<string, number>, word: string) => {
      word = word?.replace(/[^a-zA-Z]/g, "").toLowerCase();
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {}) as Record<string, number>;

  const getFavouriteData = async () => {
    const data = JSON.parse(await getFavouriteVenues(session?.user?.name));
    if (data.error) {
      console.error(data.message);
      window.alert(data.message);
      return;
    }
    const favouriteData = data.map(
      (venue: Record<string, any>) => venue["@_id"]
    );
    setFavoriteData(favouriteData);
  };

  useEffect(() => {
    getFavouriteData();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.filter}>
        <div className={styles.selections}>
          <Box sx={{ width: "30%", minWidth: "100px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Category"
                value={filterSettings.category}
                onChange={(e) =>
                  setFilterSettings({
                    ...filterSettings,
                    category: e.target.value,
                  })
                }
                defaultValue=""
              >
                <MenuItem value="">All</MenuItem>
                {Object.entries(mostAppearWords)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(
                    (word) =>
                      word[0] && (
                        <MenuItem key={word[0]} value={word[0]}>
                          {word[0]}
                        </MenuItem>
                      )
                  )}
              </Select>
            </FormControl>
          </Box>
          <TextField
            id="outlined-basic"
            variant="outlined"
            placeholder="Search by venue"
            value={filterSettings.venue}
            onChange={(e) =>
              setFilterSettings({ ...filterSettings, venue: e.target.value })
            }
          />
        </div>

        <Box sx={{ width: "10%", minWidth: "250px" }}>
          <Slider
            aria-label="Always visible"
            defaultValue={80}
            step={5}
            marks={[
              { value: 0, label: "All" },
              { value: 10, label: "1km" },
              { value: 50, label: "5km" },
              { value: 100, label: "10km" },
            ]}
            value={filterSettings.gpsMeter}
            onChange={(_, value) =>
              setFilterSettings({
                ...filterSettings,
                gpsMeter: Array.isArray(value) ? value[0] : value,
              })
            }
          />
        </Box>
      </div>
      <EventTable
        mapTable={eventKeyMap}
        eventDataArray={eventDataArray.filter((event) => {
          if (filterSettings.gpsMeter) {
            const gpsMeter = filterSettings.gpsMeter;
            const eventDistance = getDistance(
              {
                latitude: event.latitude,
                longitude: event.longitude,
              },
              {
                latitude: eventDataArray[0].latitude,
                longitude: eventDataArray[0].longitude,
              }
            );
            return eventDistance <= gpsMeter * 1000;
          }
          if (filterSettings.venue) {
            return event.venuee
              .toLowerCase()
              .includes(filterSettings.venue.toLowerCase());
          }
          if (filterSettings.category) {
            return event.venuee.toLowerCase().includes(filterSettings.category);
          }
          return true;
        })}
        setEventData={setEventData}
        actionColumnTitle={"Favourite"}
        renderActionColumn={
          favoriteData
            ? (data: Record<string, any>) => {
                return (
                  <AddToFavouriteButton
                    dataID={data["@_id"]}
                    userID={session?.user?.name}
                    defaultChecked={favoriteData.includes(data["@_id"])}
                  />
                );
              }
            : () => <CircularProgress size={14} />
        }
      />
    </div>
  );
}
