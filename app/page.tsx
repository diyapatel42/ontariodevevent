'use client';
import ExploreButton from "@/components/ExploreButton";
import {EventCard} from "@/components/EventCard";
import { useEffect, useState } from "react";

interface Event {
    _id: string;
    eventName: string; // The DB field name
    description: string;
    date: string;
    location: string;
    image: string;     // The DB field name
    slug: string;
    time: string;
    eventurl:string;
}

const Home = () => {

    // 3. Create state to hold the data
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 4. Fetch the data when the page loads
    useEffect(() => {
        fetch('/api/events')
            .then((res) => res.json())
            .then((data) => {
                setEvents(data);
                setIsLoading(false);
            })
            .catch((err) => console.error("Failed to load events", err));
    }, []);
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
            <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center min-h-screen px-4 max-w-7xl mx-auto">
                {events.map((event) => (
                    <EventCard

                        key={event._id}
                        _id={event._id}
                        title={event.eventName}     // Mapping DB 'eventName' to Component 'title'
                        image={event.image}         // Mapping DB 'image' to Component 'image'
                        description={event.description}
                        date={event.date}
                        location={event.location}
                        time={event.time}
                        slug={event.slug}
                        eventName={event.eventName}
                        eventurl={event.eventurl}
                    />
                    ))
                }
            </section>
        </>


    )
}
export default Home