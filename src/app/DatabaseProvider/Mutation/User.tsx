"use server";

import mongoose from "mongoose";
import { connectToMongoDB } from "../db";
import User from "../Model/User";
import Venue from "../Model/Venue";
import bcrypt from "bcrypt-nodejs";

export async function createUsers(data: any) {
  await connectToMongoDB();
  try {
    const newUser = await User.create(data);
    return JSON.stringify(newUser);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error creating user: ${error}`,
    });
  }
}

export async function deleteUsers(data: any) {
  await connectToMongoDB();
  try {
    const deletedUser = await User.findByIdAndDelete(data._id);
    return JSON.stringify(deletedUser);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error deleting user: ${error}`,
    });
  }
}

export async function checkNoOfAdmins() {
  await connectToMongoDB();
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    return JSON.stringify(adminCount);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error checking number of admins: ${error}`,
    });
  }
}

export async function getUsers() {
  await connectToMongoDB();
  try {
    const users = await User.find();
    return JSON.stringify(users);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error getting users: ${error}`,
    });
  }
}

export async function userLogin(data: any) {
  await connectToMongoDB();
  try {
    const user = await User.findOne({ userName: data.username });
    if (!user) {
      return JSON.stringify({
        error: true,
        message: "User not found",
      });
    }
    if (!bcrypt.compareSync(data.password, user.password)) {
      console.log("Incorrect password");
      return JSON.stringify({
        error: true,
        message: "Incorrect password",
      });
    }
    return JSON.stringify(user);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error logging in: ${error}`,
    });
  }
}

export async function modifyUsers(data: any) {
  await connectToMongoDB();
  try {
    const updatedUser = await User.findByIdAndUpdate(data._id, data, {
      new: true,
    });
    return JSON.stringify(updatedUser);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error modifying user: ${error}`,
    });
  }
}

export async function addFavouriteVenue(
  favouriteVenueID: string,
  userName: string
) {
  await connectToMongoDB();
  try {
    const updatedUser = await User.find({ userName });
    if (!updatedUser) {
      return JSON.stringify({
        error: true,
        message: "User not found",
      });
    }
    const favouriteVenue = await Venue.findOne({
      "@_id": favouriteVenueID,
    });
    if (!favouriteVenue) {
      return JSON.stringify({
        error: true,
        message: "Venue not found",
      });
    }

    const updatedFavouriteVenue: mongoose.Schema.Types.ObjectId[] =
      updatedUser[0].favouriteVenue || [];
    updatedFavouriteVenue.push(
      favouriteVenue._id as mongoose.Schema.Types.ObjectId
    );

    const updated = await User.findOneAndUpdate(
      { userName },
      { favouriteVenue: updatedFavouriteVenue },
      { new: true }
    );
    return JSON.stringify(updated);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error adding favourite venue: ${error}`,
    });
  }
}

export async function removeFavouriteVenue(
  favouriteVenueID: string,
  userName: string
) {
  await connectToMongoDB();
  try {
    const updatedUser = await User.find({ userName });
    if (!updatedUser) {
      return JSON.stringify({
        error: true,
        message: "User not found",
      });
    }

    const favouriteVenue = (await Venue.findOne({
      "@_id": favouriteVenueID,
    })) as Record<string, any>;
    if (!favouriteVenue) {
      return JSON.stringify({
        error: true,
        message: "Venue not found",
      });
    }

    const updatedFavouriteVenue: mongoose.Schema.Types.ObjectId[] =
      updatedUser[0].favouriteVenue || [];
    const filteredFavouriteVenue = updatedFavouriteVenue.filter(
      (venueID) => venueID.toString() !== favouriteVenue["_id"].toString()
    );

    const updated = await User.findOneAndUpdate(
      { userName },
      { favouriteVenue: filteredFavouriteVenue },
      { new: true }
    );
    return JSON.stringify(updated);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error removing favourite venue: ${error}`,
    });
  }
}

export async function getFavouriteVenues(userName: string) {
  await connectToMongoDB();
  try {
    const user = await User.findOne({
      userName,
    });
    if (!user) {
      return JSON.stringify({
        error: true,
        message: "User not found",
      });
    }
    const favouriteVenues = await Venue.find({
      _id: { $in: user.favouriteVenue },
    });
    return JSON.stringify(favouriteVenues);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: `Error getting favourite venues: ${error}`,
    });
  }
}
