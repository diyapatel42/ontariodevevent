// app/api/events/route.ts
import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";
import { v2 as cloudinary } from 'cloudinary';

// Ensure Cloudinary is configured (usually done here or in a separate config file)
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. GET Request: Fetches data FROM the database to show in browser/app
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("ontario_events");

        // Fetch all events
        const events = await db.collection("events").find({}).toArray();

        return NextResponse.json(events);
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

// 2. POST Request: Sends data INTO the database
export async function POST(request: Request) {
    try {
        // Switch to formData to handle both Text and Files
        const formData = await request.formData();

        // Extract text fields
        const eventName = formData.get('eventName');
        const location = formData.get('location');

        // --- VALIDATION STEP ---
        if (!eventName || !location) {
            return NextResponse.json(
                { error: "Validation Failed: 'eventName' and 'location' are required." },
                { status: 400 }
            );
        }

        // --- IMAGE UPLOAD STEP ---
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }).end(buffer);
        });

        // Construct the final object to save to MongoDB
        const eventBody: any = {};

        // Add all text fields from form data to the object
        formData.forEach((value, key) => {
            if (key !== 'image') {
                eventBody[key] = value;
            }
        });

        // Add the Cloudinary URL
        eventBody.image = (uploadResult as { secure_url: string }).secure_url;

        // --- DATABASE INSERTION ---
        const client = await clientPromise;
        const db = client.db("ontario_events");

        const result = await db.collection("events").insertOne(eventBody);

        return NextResponse.json({ success: true, result });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
