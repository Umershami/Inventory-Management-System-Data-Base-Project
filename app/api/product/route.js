import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri = "mongodb+srv://mongodb:mumer123@cluster0.99tx6yw.mongodb.net/stock";
  const client = new MongoClient(uri);
  
  try {
  
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const query = {};
    const products = await inventory.find(query).toArray();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  } finally {
    await client.close();
  }
}
export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const uri = "mongodb+srv://mongodb:mumer123@cluster0.99tx6yw.mongodb.net/stock";
    client = new MongoClient(uri);
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const result = await inventory.insertOne(body);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ success: false, error: 'Failed to add product' }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
