"use server";

import { connectToMongoDB } from "../db";
import Venue from "../Model/Venue";
import Comment from "../Model/Comment";

export async function insertORupdateVenue(data: any) {
  await connectToMongoDB();
  try {
    const newVenue = await Venue.updateMany(data, data, {
      upsert: true,
    });
    return JSON.stringify(newVenue);
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: `Error creating venue: ${error}`,
    };
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
      message: `Error getting venues: ${error}`,
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
        const updatedVenue = await Venue.findOneAndUpdate(
          { "@_id": item["@_id"] },
          item,
          { new: true }
        );
        results.updated.push(updatedVenue);
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
    return JSON.stringify({
      error: true,
      message: `Error handling venue data: ${error}`,
    });
  }
}

export async function addCommentToVenue(commentID: any, venueID: string) {
  try {
    await connectToMongoDB();
    const venue = await Venue.findOneAndUpdate(
      { "@_id": venueID },
      { $push: { comment: commentID } },
      { new: true }
    );
    if (!venue) {
      return JSON.stringify({
        error: true,
        message: "Venue not found",
      });
    }

    return JSON.stringify(venue);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error adding comment to venue: ${error}`,
    });
  }
}

export async function getVenueComments(venueID: string) {
  try {
    await connectToMongoDB();
    const venue = await Venue.findOne({ "@_id": venueID }).populate("comment");
    if (!venue) {
      return JSON.stringify({
        error: true,
        message: "Venue not found",
      });
    }

    return JSON.stringify(venue.comment);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error getting venue comments: ${error}`,
    });
  }
}
