"use server";
import client from "@/lib/mongodb";

export async function uploadData(data: any) {
  try {
    const db = client.db("project");
    const collection = db.collection("events");
    await collection.insertMany(data);
  } catch (e) {
    console.error(e);
  }
}

export async function downloadEventData() {
  try {
    const db = client.db("project");
    const collection = db.collection("events");
    const data = await collection.find().toArray();
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function deleteData() {
  try {
    const db = client.db("project");
    const collection = db.dropCollection("events");
  } catch (e) {
    console.error(e);
  }
}
