import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri = "mongodb+srv://mongodb:mumer123@cluster0.99tx6yw.mongodb.net/";
  const client = new MongoClient(uri);

  try {
     // Connect to the MongoDB server
    
    const database = client.db('stock');
    const movies = database.collection('inventory');
    
    // Query for a movie that has the title 'Back to the Future'
    const query = {};
    const movie = await movies.find(query).toArray();
    
    console.log(movie);

    // Return a JSON response with the movie data
    return NextResponse.json({"a": 36,movie});
  } finally {
    // Ensure the client is closed when done
    await client.close();
  }
}
