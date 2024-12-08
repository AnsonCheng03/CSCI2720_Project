"use server";

import { connectToMongoDB } from "../db";
import Event from "../Model/Events";

export async function uploadData(data: any) {
  try {
    await connectToMongoDB();
    try {
      // get the event id and transform it to object id

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
  } catch (e) {
    console.error(e);
    return JSON.stringify({
      error: true,
      message: "error connecting to database",
    });
  }
}

export async function editData(data: any) {
  await connectToMongoDB();
  try {
    const updatedEvent = await Event.findByIdAndUpdate(data["@_id"], data, {
      new: true,
    });
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
    const events = await Event.find();
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
    const deletedEvent = await Event.findByIdAndDelete(eventId);
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
