import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function DELETE(request) {
  // Ensure the request method is DELETE
  if (request.method !== 'DELETE') {
    return NextResponse.error("Method Not Allowed", { status: 405 });
  }

  try {
    // Parse the request body to get the product name
    const { productName } = await request.json();

    // Check if productName is provided
    if (!productName) {
      return NextResponse.error("Product name is required", { status: 400 });
    }

    const uri = "mongodb+srv://mongodb:mumer123@cluster0.99tx6yw.mongodb.net/";
    const client = new MongoClient(uri);

    try {
      // Connect to the MongoDB client
      await client.connect();
      const database = client.db('stock');
      const inventory = database.collection('inventory');

      // Create a filter for the productName
      const filter = { productName: productName };

      // Delete the document from the inventory collection
      const result = await inventory.deleteOne(filter);

      if (result.deletedCount === 0) {
        return NextResponse.error(`Product with name '${productName}' not found`, { status: 404 });
      }

      // Return the result as a JSON response
      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} document(s) deleted`,
      });
    } finally {
      // Ensure the client is closed after the operation completes
      await client.close();
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}
