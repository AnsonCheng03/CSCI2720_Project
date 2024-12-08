import mongoose, { Document, Model } from "mongoose";

export interface IUser {
  userName: string;
  password: string;
  role: string;
  favouriteVenue?: [mongoose.Schema.Types.ObjectId];
  darkMode?: boolean | null;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
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

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
