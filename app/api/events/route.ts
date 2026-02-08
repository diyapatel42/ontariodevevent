// app/api/events/route.ts
import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

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
        const body = await request.json();

        // --- VALIDATION STEP ---
        if (!body.eventName || !body.location) {
            return NextResponse.json(
                { error: "Validation Failed: 'eventName' and 'location' are required." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("ontario_events");

        const result = await db.collection("events").insertOne(body);

        return NextResponse.json({ success: true, result });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
