"use server";

import { connectToMongoDB } from "./db";
import Event from "./Model/Events";

export async function uploadData(data: any) {
  try {
    await connectToMongoDB();
    try {
      const newEvent = await Event.create(data);
      newEvent.save();
      // revalidatePath("/");
      return newEvent.toString();
    } catch (error) {
      console.log(error);
      return { message: "error creating todo" };
    }
  } catch (e) {
    console.error(e);
  }
}

export async function editData(data: any) {
  await connectToMongoDB();
  try {
    const updatedEvent = await Event.findByIdAndUpdate(data["@_id"], data, {
      new: true,
    });
    if (!updatedEvent) {
      return { message: "Event not found" };
    }
    updatedEvent.save();
    // revalidatePath("/");
    return updatedEvent.toString();
  } catch (error) {
    console.log(error);
    return { message: "error updating todo" };
  }
}

export async function downloadEventData() {
  await connectToMongoDB();
  try {
    const events = await Event.find();
    return events;
  } catch (error) {
    console.log(error);
    return { message: "error fetching todos" };
  }
}

export async function deleteData() {
  await connectToMongoDB();
  try {
    const deletedEvents = await Event.deleteMany({});
    return deletedEvents;
  } catch (error) {
    console.log(error);
    return { message: "error deleting todos" };
  }
}

export async function deleteEvent(eventId: string) {
  await connectToMongoDB();
  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return { message: "Event not found" };
    }
    return deletedEvent;
  } catch (error) {
    console.log(error);
    return { message: "error deleting todo" };
  }
}
