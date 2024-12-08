import mongoose, { Document, Model } from "mongoose";

export interface IUser {
  "@_id": string;
  userName: string;
  password: string;
  favouriteVenue?: [mongoose.Schema.Types.ObjectId];
  darkMode?: boolean | null;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    "@_id": {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    favouriteVenue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
      },
    ],
    darkMode: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
