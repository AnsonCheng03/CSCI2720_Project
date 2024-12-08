"use server";

import { connectToMongoDB } from "../db";
import Venue from "../Model/Venue";

export async function insertORupdateVenue(data: any) {
  try {
    await connectToMongoDB();
    try {
      const newVenue = await Venue.updateMany(data, data, {
        upsert: true,
      });
      return newVenue.toString();
    } catch (error) {
      console.log(error);
      return {
        error: true,
        message: "error creating venue",
      };
    }
  } catch (e) {
    console.error(e);
  }
}

export async function downloadVenueData() {
  await connectToMongoDB();
  try {
    const venues = await Venue.find();
    return JSON.stringify(venues);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error fetching venues",
    });
  }
}

export async function handleVenueData(data: any[]) {
  try {
    await connectToMongoDB();
    const results = {
      inserted: [],
      updated: [],
      downloaded: [],
    } as {
      inserted: any[];
      updated: any[];
      downloaded: any[];
    };

    for (const item of data) {
      const existingVenue = await Venue.findOne({ "@_id": item["@_id"] });

      if (existingVenue) {
        await Venue.updateOne({ "@_id": item["@_id"] }, item);
        results.updated.push(existingVenue);
      } else {
        const newVenue = new Venue(item);
        await newVenue.save();
        results.inserted.push(newVenue);
      }
    }

    const dataIds = data.map((item) => item["@_id"]);
    const remainingVenues = await Venue.find({ "@_id": { $nin: dataIds } });
    results.downloaded = remainingVenues;

    return JSON.stringify(results);
  } catch (error) {
    console.error(error);

    return JSON.stringify({
      error: true,
      message: "error handling venues",
    });
  }
}
