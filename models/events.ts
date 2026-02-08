// models/Event.ts
import mongoose, { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true },
        eventName: { type: String, required: true },
        location: { type: String },
        date: { type: Date },
        image: { type: String },
        description: { type: String },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
        strict: false // Allows you to save fields not in this list (good for rapid prototyping)
    }
);

// Check if the model is already compiled (Next.js hot reload fix).
// If yes, use it. If no, create it.
const Event = models.Event || model("Event", EventSchema);

export default Event;
