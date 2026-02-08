import ExploreButton from "@/components/ExploreButton";
import {EventCard} from "@/components/EventCard";
import {IEvent} from "@/database/event.model";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {
    // FIX: Use parentheses, not backticks
    const response = await fetch(`${BASE_URL}/api/events`, {
        cache: 'no-store'
    });
    const data = await response.json();
    const events = data.events || [];

    return (
        <>
            <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                <h1 className='text-shadow-purple-300 text-green-200 text-6xl text-center'>
                    Top Tech Events in Ontario
                </h1>
                <p className='text-white text-center mt-4 max-w-2xl'>
                    This is a hub for dev events happening in Ontario
                </p>
                <ExploreButton />
            </section>

            {/* FIX: Remove the outer grid, just use flex or block */}
            <section className="relative z-10 px-4 py-20 max-w-7xl mx-auto">
                <h3 className="text-white text-3xl font-bold mb-8">Featured Events</h3>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events && events.length > 0 && events.map((event: IEvent) => (
                        <li key={event._id || event.title} className="list-none">
                            <EventCard {...event} />
                        </li>
                    ))}
                </ul>
            </section>
        </>
    )
}

export default Home;