import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request) {
  let { action, productName, initialQuantity } = await request.json();
  
  // Correct the variable name for console logging
  console.log( action, productName, initialQuantity );

  const uri = "mongodb+srv://mongodb:mumer123@cluster0.99tx6yw.mongodb.net/";
  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB client
    const database = client.db('stock');
    const inventory = database.collection('inventory');  // Use 'inventory' instead of 'movies'

    // Create a filter for the productName
    const filter = { productName: productName };

    // Set the upsert option to insert a document if no documents match the filter


    // Correct the calculation for newquantity
    let newQuantity = action == "plus" ? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) - 1);

    // Create the update document
    const updateDoc = {
      $set: {
        quantity: newQuantity,
      },
    };

    // Update the document in the inventory collection
    const result = await inventory.updateOne(filter, updateDoc, {});

    // Return the result as a JSON response
    return NextResponse.json({
      success: true,
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    });
  } 
  finally {
    // Ensure the client is closed after the operation completes
    await client.close();
  }
}
