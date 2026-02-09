import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { IEvent } from "@/database/event.model";

export const getEventPageData = unstable_cache(
    async (slug: string) => {
        await connectDB();

        const event = await Event.findOne({ slug }).lean<IEvent | null>();
        if (!event) return null;

        const similarEvents = await getSimilarEventsBySlug(slug);

        return {
            event,
            similarEvents,
        };
    },
    ["event-page"],
    {
        revalidate: 300, // cache for 5 minutes
    }
);
