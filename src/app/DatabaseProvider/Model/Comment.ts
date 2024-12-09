// Importing mongoose library along with Document and Model types from it
import mongoose, { Document, Model } from "mongoose";

export interface IComment {
  userName: string;
  content: string;
  likedBy?: [mongoose.Schema.Types.ObjectId];
}

export interface ICommentDocument extends IComment, Document {
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<ICommentDocument>(
  {
    userName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment: Model<ICommentDocument> =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
