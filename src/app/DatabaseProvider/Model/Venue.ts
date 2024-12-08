// Importing mongoose library along with Document and Model types from it
import mongoose, { Document, Model } from "mongoose";

export interface IVenue {
  "@_id": string;
  venuec: string;
  venuee: string;
  latitude: number;
  longitude: number;
  comment?: [mongoose.Schema.Types.ObjectId];
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
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Venue: Model<IVenueDocument> =
  mongoose.models.Venue || mongoose.model("Venue", venueSchema);

export default Venue;
