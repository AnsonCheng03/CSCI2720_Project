"use server";

import { connectToMongoDB } from "./db";
import Event from "./Model/Events";

export async function uploadData(data: any) {
  try {
    await connectToMongoDB();
    // const db = client.db("project");
    // const collection = db.collection("events");
    // await collection.insertMany(data);
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
  // try {
  //   const db = client.db("project");
  //   const collection = db.collection("events");
  //   await collection
  //     .updateOne({ "@_id": data["@_id"] }, { $set: { ...data } })
  //     .then((result) => {
  //       console.log(`Successfully updated document: ${result}`);
  //     });
  // } catch (e) {
  //   console.error(e);
  // }
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
  // try {
  //   const db = client.db("project");
  //   const collection = db.collection("events");
  //   const data = await collection.find().toArray();
  //   return data;
  // } catch (e) {
  //   console.error(e);
  // }
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
  // try {
  //   const db = client.db("project");
  //   const collection = db.dropCollection("events");
  // } catch (e) {
  //   console.error(e);
  // }
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
  // try {
  //   const db = client.db("project");
  //   const collection = db.collection("events");
  //   await collection.deleteOne({ "@_id": eventId });
  // } catch (e) {
  //   console.error(e);
  // }
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
