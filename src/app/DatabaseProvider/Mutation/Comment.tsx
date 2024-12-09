"use server";

import mongoose from "mongoose";
import { connectToMongoDB } from "../db";
import Comment from "../Model/Comment";

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
