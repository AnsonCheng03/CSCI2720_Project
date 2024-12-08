"use server";

import { connectToMongoDB } from "../db";
import User from "../Model/User";
import bcrypt from "bcrypt-nodejs";

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

export async function deleteUsers(data: any) {
  await connectToMongoDB();
  try {
    const deletedUser = await User.findByIdAndDelete(data._id);
    return JSON.stringify(deletedUser);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error deleting user",
    });
  }
}

export async function checkNoOfAdmins() {
  await connectToMongoDB();
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    return JSON.stringify(adminCount);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error checking number of admins",
    });
  }
}

export async function getUsers() {
  await connectToMongoDB();
  try {
    const users = await User.find();
    return JSON.stringify(users);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error getting users",
    });
  }
}

export async function userLogin(data: any) {
  await connectToMongoDB();
  try {
    const user = await User.findOne({ userName: data.username });
    if (!user) {
      return JSON.stringify({
        error: true,
        message: "User not found",
      });
    }
    if (!bcrypt.compareSync(data.password, user.password)) {
      console.log("Incorrect password");
      return JSON.stringify({
        error: true,
        message: "Incorrect password",
      });
    }
    return JSON.stringify(user);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error logging in",
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
