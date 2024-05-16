import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query");
    console.log(query, typeof query);

    const uri = "mongodb+srv://mongodb:mumer123@cluster0.99tx6yw.mongodb.net/stock"; // Include database name in the connection string
    const client = new MongoClient(uri);

    try {
        await client.connect(); // Connect to the MongoDB server

        const database = client.db();
        const inventory = database.collection('inventory');

        const products = await inventory.aggregate([
            {
                $match: {
                    $or: [
                        { productName: { $regex: query, $options: "i" } }, // Partial or full match for productName
                        { quantity: { $regex: query, $options: "i" } },    // Partial or full match for quantity
                        { price: { $regex: query, $options: "i" } }         // Partial or full match for price
                    ]
                }
            }
        ]).toArray();
        
        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.error({ message: "An error occurred while processing your request." });
    } finally {
        await client.close();
    }
}
