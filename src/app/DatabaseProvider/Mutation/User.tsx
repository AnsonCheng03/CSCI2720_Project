"use server";

import { connectToMongoDB } from "../db";
import User from "../Model/User";

export async function createUsers(data: any) {
  await connectToMongoDB();
  try {
    const newUser = await User.create(data);
    return JSON.stringify(newUser);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error creating user",
    });
  }
}

export async function modifyUsers(data: any) {
  await connectToMongoDB();
  try {
    const updatedUser = await User.findByIdAndUpdate(data._id, data, {
      new: true,
    });
    return JSON.stringify(updatedUser);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error updating user",
    });
  }
}
