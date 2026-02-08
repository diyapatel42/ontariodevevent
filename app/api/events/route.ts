import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();

        const file = formData.get('image');
        if(!file) {
            return NextResponse.json({ message: 'Image file is required'}, { status: 400 });
        }

        // Validate file is actually a File/Blob
        if (!(file instanceof Blob)) {
            return NextResponse.json({
                message: 'Invalid file format. Expected a File or Blob.'
            }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({
                message: `Invalid file type: ${file.type}. Allowed types: ${validTypes.join(', ')}`
            }, { status: 400 });
        }

        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({
                message: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`
            }, { status: 400 });
        }

        const tags = JSON.parse(formData.get('tags') as string);
        const agenda = JSON.parse(formData.get('agenda') as string);

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log('File details:', {
            name: file.name,
            type: file.type,
            size: file.size,
            bufferLength: buffer.length
        });

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'DevEvent'
                },
                (error, result) => {
                    if(error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );

            uploadStream.end(buffer);
        });

        const eventData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            overview: formData.get('overview') as string,
            venue: formData.get('venue') as string,
            location: formData.get('location') as string,
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            mode: formData.get('mode') as string,
            audience: formData.get('audience') as string,
            organizer: formData.get('organizer') as string,
            eventurl: formData.get('eventurl') as string,
            image: (uploadResult as any).secure_url,
            tags,
            agenda
        };

        console.log('Event data to create:', eventData);

        const createdEvent = await Event.create(eventData);

        return NextResponse.json({
            message: 'Event created successfully',
            event: createdEvent
        }, { status: 201 });
    } catch (e) {
        console.error('Full error:', e);
        return NextResponse.json({
            message: 'Event Creation Failed',
            error: e instanceof Error ? e.message : JSON.stringify(e)
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}