// Importing mongoose library along with Document and Model types from it
import mongoose, { Document, Model } from "mongoose";

export interface IVenue {
  "@_id": string;
  userName: string;
  content: string;
  likedBy?: [mongoose.Schema.Types.ObjectId];
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
    userName: {
      type: String,
    },
    content: {
      type: String,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment: Model<IVenueDocument> =
  mongoose.models.Comment || mongoose.model("Comment", venueSchema);

export default Comment;
