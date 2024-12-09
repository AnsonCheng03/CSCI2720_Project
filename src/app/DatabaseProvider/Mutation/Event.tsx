"use server";

import { connectToMongoDB } from "../db";
import Event from "../Model/Events";
import Venue from "../Model/Venue";
import User from "../Model/User";
import mongoose from "mongoose";

export async function uploadData(data: any) {
  await connectToMongoDB();
  try {
    // get the event id and transform it to object id
    const elementVenue = data.venueid;
    const venue = await Venue.find({ "@_id": elementVenue });
    if (venue.length === 0) {
      return JSON.stringify({
        error: true,
        message: "Venue not found",
      });
    }
    data.venueid = venue[0]._id;

    const newEvent = await Event.create(data);
    newEvent.save();
    // revalidatePath("/");
    return JSON.stringify(newEvent);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error adding data",
    });
  }
}

export async function editData(data: any) {
  await connectToMongoDB();
  try {
    const elementVenue = data.venueid;
    const venue = await Venue.find({ "@_id": elementVenue });
    if (venue.length === 0) {
      return JSON.stringify({
        error: true,
        message: "Venue not found",
      });
    }
    data.venueid = venue[0]._id;

    const updatedEvent = await Event.findOneAndUpdate(
      { "@_id": data["@_id"] },
      data,
      { new: true }
    );
    if (!updatedEvent) {
      return JSON.stringify({
        error: true,
        message: "Event not found",
      });
    }

    updatedEvent.save();
    // revalidatePath("/");
    return JSON.stringify(updatedEvent);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error updating todo",
    });
  }
}

export async function downloadEventData() {
  await connectToMongoDB();
  try {
    const events = await Event.find()
      .populate("venueid")
      .populate("joinedUsers")
      .populate("likedUsers");
    return JSON.stringify(events);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error fetching todos",
    });
  }
}

export async function deleteData() {
  await connectToMongoDB();
  try {
    const deletedEvents = await Event.deleteMany({});
    return JSON.stringify(deletedEvents);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error deleting todos",
    });
  }
}

export async function deleteEvent(eventId: string) {
  await connectToMongoDB();
  try {
    const deletedEvent = await Event.findOneAndDelete({ "@_id": eventId });
    if (!deletedEvent) {
      return JSON.stringify({ message: "Event not found" });
    }
    return JSON.stringify(deletedEvent);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error deleting todo",
    });
  }
}

export async function joinEvent(eventId: string, userName: string) {
  await connectToMongoDB();
  try {
    const event = await Event.findOne({ "@_id": eventId });
    if (!event) {
      return JSON.stringify({ message: "Event not found" });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return JSON.stringify({ message: "User not found" });
    }

    if (
      event?.joinedUsers?.includes(user._id as mongoose.Schema.Types.ObjectId)
    ) {
      // unjoin
      const updatedEvent = await Event.findOneAndUpdate(
        { "@_id": eventId },
        { $pull: { joinedUsers: user._id } },
        { new: true }
      );
      if (!updatedEvent) {
        return JSON.stringify({ message: "Event not found" });
      }

      updatedEvent.save();

      return JSON.stringify({
        "@_joinAction": false,
        ...updatedEvent,
      });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { "@_id": eventId },
      { $push: { joinedUsers: user._id } },
      { new: true }
    );
    if (!updatedEvent) {
      return JSON.stringify({ message: "Event not found" });
    }

    updatedEvent.save();

    return JSON.stringify({ ...updatedEvent, "@_joinAction": true });
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error joining event",
    });
  }
}

export async function getEventParticipants(eventId: string) {
  await connectToMongoDB();
  try {
    const event = await Event.find({ "@_id": eventId }).populate("joinedUsers");
    if (!event) {
      return JSON.stringify({ message: "Event not found" });
    }

    return JSON.stringify(event[0].joinedUsers);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error getting event participants",
    });
  }
}

export async function removeParticipant(eventId: string, userId: string) {
  await connectToMongoDB();
  try {
    const event = await Event.findOne({ "@_id": eventId });
    if (!event) {
      return JSON.stringify({ message: "Event not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return JSON.stringify({ message: "User not found" });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { "@_id": eventId },
      { $pull: { joinedUsers: user._id } },
      { new: true }
    );
    if (!updatedEvent) {
      return JSON.stringify({ message: "Event not found" });
    }

    updatedEvent.save();

    return JSON.stringify(updatedEvent);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error removing participant",
    });
  }
}

export async function likeEvent(eventId: string, userName: string) {
  await connectToMongoDB();
  try {
    const event = await Event.findOne({ "@_id": eventId });
    if (!event) {
      return JSON.stringify({ message: "Event not found" });
    }

    const user = await User.findOne({
      userName,
    });
    if (!user) {
      return JSON.stringify({ message: "User not found" });
    }

    if (
      event?.likedUsers?.includes(user._id as mongoose.Schema.Types.ObjectId)
    ) {
      // unlike
      const updatedEvent = await Event.findOneAndUpdate(
        { "@_id": eventId },
        { $pull: { likedUsers: user._id } },
        { new: true }
      );
      if (!updatedEvent) {
        return JSON.stringify({ message: "Event not found" });
      }

      updatedEvent.save();

      return JSON.stringify({
        "@_likeAction": false,
        ...updatedEvent,
      });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { "@_id": eventId },
      { $push: { likedUsers: user._id } },
      { new: true }
    );
    if (!updatedEvent) {
      return JSON.stringify({ message: "Event not found" });
    }

    updatedEvent.save();

    return JSON.stringify({
      ...updatedEvent,
      "@_likeAction": true,
    });
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error liking event",
    });
  }
}

export async function getEventLikes(eventId: string, userName: string) {
  await connectToMongoDB();
  try {
    const event = await Event.findOne({ "@_id": eventId });
    if (!event) {
      return JSON.stringify({ message: "Event not found" });
    }

    const user = await User.findOne({
      userName,
    });
    if (!user) {
      return JSON.stringify({ message: "User not found" });
    }

    const output = {
      liked: event.likedUsers?.includes(
        user._id as mongoose.Schema.Types.ObjectId
      ),
      likes: event.likedUsers?.length || 0,
    };

    return JSON.stringify(output);
  } catch (error) {
    console.log(error);
    return JSON.stringify({
      error: true,
      message: "error getting event likes",
    });
  }
}
