// Importing mongoose library along with Document and Model types from it
import mongoose, { Document, Model } from "mongoose";

export interface IEvent {
  "@_id": string;
  titlee: string;
  venueid: mongoose.Schema.Types.ObjectId;
  predateE: string;
  desce: string;
  presenterorge: string;
  pricee: string;
  quota?: number;
  joinedUsers?: mongoose.Schema.Types.ObjectId[];
  likedUsers?: mongoose.Schema.Types.ObjectId[];
  fromDownload?: boolean;
}

export interface IEventDocument extends IEvent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema<IEventDocument>(
  {
    "@_id": {
      type: String,
      required: true,
    },
    titlee: {
      type: String,
    },
    venueid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "venue",
      required: true,
    },
    predateE: {
      type: String,
    },
    desce: {
      type: String,
    },
    presenterorge: {
      type: String,
    },
    pricee: {
      type: String,
    },
    quota: {
      type: Number,
      default: undefined,
    },
    joinedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
          validator: function (v) {
            if (this.quota === undefined) return true;
            return v.length < this.quota;
          },
          message: "Joined users must be less than quota",
        },
      },
    ],
    likedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    fromDownload: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Event: Model<IEventDocument> =
  mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
