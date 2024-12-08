// Importing mongoose library along with Document and Model types from it
import mongoose, { Document, Model } from "mongoose";

export interface IEvent {
  "@_id": string;
  titlee: string;
  venueid: string;
  predateE: string;
  desce: string;
  presenterorge: string;
  pricee: string;
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
      type: String,
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
  },
  {
    timestamps: true,
  }
);

const Event: Model<IEventDocument> =
  mongoose.models?.Event || mongoose.model("Event", eventSchema);

export default Event;
