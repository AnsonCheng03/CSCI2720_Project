import mongoose, { Connection } from "mongoose";
import { eventSchema } from "./Model/Events";
import { userSchema } from "./Model/User";
import { venueSchema } from "./Model/Venue";
import { commentSchema } from "./Model/Comment";

let cachedConnection: Connection | null = null;

export async function connectToMongoDB() {
  // If a cached connection exists, return it
  if (cachedConnection) {
    console.log("Using cached db connection");
    return cachedConnection;
  }
  try {
    // If no cached connection exists, establish a new connection to MongoDB
    const cnx = await mongoose.connect(process.env.MONGODB_URI!);
    // Cache the connection for future use
    cachedConnection = cnx.connection;
    // Load the models
    await Promise.all([
      mongoose.models.Event || cnx.model("Event", eventSchema),
      mongoose.models.User || cnx.model("User", userSchema),
      mongoose.models.Venue || cnx.model("Venue", venueSchema),
      mongoose.models.Comment || cnx.model("Comment", commentSchema),
    ]);
    // Log message indicating a new MongoDB connection is established
    console.log("New mongodb connection established");
    // Return the newly established connection
    return cachedConnection;
  } catch (error) {
    // If an error occurs during connection, log the error and throw it
    console.log(error);
    throw error;
  }
}
