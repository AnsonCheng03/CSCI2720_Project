"use server";
import client from "@/lib/mongodb";

export async function uploadData(data: any) {
  try {
    const db = client.db("project");
    const collection = db.collection("locations");
    await collection.insertMany(data);
  } catch (e) {
    console.error(e);
  }
}

export async function downloadData() {
  try {
    const db = client.db("project");
    const collection = db.collection("locations");
    const data = await collection.find().toArray();
    console.log(data);
    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function deleteData() {
  try {
    const db = client.db("project");
    const collection = db.dropCollection("locations");
  } catch (e) {
    console.error(e);
  }
}
