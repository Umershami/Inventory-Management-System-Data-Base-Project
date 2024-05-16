import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri = "mongodb+srv://mongodb:mumer123@cluster0.99tx6yw.mongodb.net/stock"; // Include database name in the connection string
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to the MongoDB server

    const database = client.db();
    const inventory = database.collection('inventory');

    const query = {};
    const products = await inventory.find(query).toArray();

    return NextResponse.json({ success:true, products});
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  let body = await request.json();
  console.log(body)
  const uri = "mongodb+srv://mongodb:mumer123@cluster0.99tx6yw.mongodb.net/stock";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db();
    const inventory = database.collection('inventory');

    const products = await inventory.insertOne(body);

    return NextResponse.json({ products, ok: true });
  } finally {
    await client.close();
  }
}
