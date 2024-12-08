// Importing mongoose library along with Document and Model types from it
import mongoose, { Document, Model } from "mongoose";

export interface IVenue {
  "@_id": string;
  venuec: string;
  venuee: string;
  latitude: number;
  longitude: number;
  "@_eventCount": number;
}

export interface IVenueDocument extends IVenue, Document {
  createdAt: Date;
  updatedAt: Date;
}

const venueSchema = new mongoose.Schema<IVenueDocument>(
  {
    "@_id": {
      type: String,
      required: true,
    },
    venuec: {
      type: String,
    },
    venuee: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    "@_eventCount": {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Venue: Model<IVenueDocument> =
  mongoose.models?.Venue || mongoose.model("Venue", venueSchema);

export default Venue;
