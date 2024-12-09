"use server";

import mongoose from "mongoose";
import { connectToMongoDB } from "../db";
import Comment from "../Model/Comment";
import User from "../Model/User";

export async function createComment(data: any) {
  await connectToMongoDB();
  try {
    const newComment = await Comment.create(data);
    return JSON.stringify(newComment);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error creating comment",
    });
  }
}

export async function deleteComment(data: any) {
  await connectToMongoDB();
  try {
    const deletedComment = await Comment.findByIdAndDelete(data._id);
    return JSON.stringify(deletedComment);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error deleting comment",
    });
  }
}

export async function getComments() {
  await connectToMongoDB();
  try {
    const comments = await Comment.find();
    return JSON.stringify(comments);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error getting comments",
    });
  }
}

export async function likeComment(data: any, userName: string) {
  await connectToMongoDB();
  try {
    const comment = await Comment.findById(data._id);
    if (!comment) {
      return JSON.stringify({
        error: true,
        message: "Comment not found",
      });
    }

    const likedUser = await User.findOne({ userName });
    if (!likedUser) {
      return JSON.stringify({
        error: true,
        message: "User not found",
      });
    }

    if (
      comment.likedBy?.includes(likedUser._id as mongoose.Schema.Types.ObjectId)
    ) {
      return JSON.stringify({
        error: true,
        message: "Already liked",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      data._id,
      {
        $push: { likedBy: likedUser._id },
      },
      { new: true }
    );
    return JSON.stringify(updatedComment);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error liking comment",
    });
  }
}

export async function unlikeComment(data: any, userName: string) {
  await connectToMongoDB();
  try {
    const comment = await Comment.findById(data._id);
    if (!comment) {
      return JSON.stringify({
        error: true,
        message: "Comment not found",
      });
    }
    const likedUser = await User.findOne({
      userName,
    });
    if (!likedUser) {
      return JSON.stringify({
        error: true,
        message: "User not found",
      });
    }
    if (
      !comment.likedBy?.includes(
        likedUser._id as mongoose.Schema.Types.ObjectId
      )
    ) {
      return JSON.stringify({
        error: true,
        message: "Not liked",
      });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      data._id,
      {
        $pull: { likedBy: likedUser._id },
      },
      { new: true }
    );
    return JSON.stringify(updatedComment);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error unliking comment",
    });
  }
}
