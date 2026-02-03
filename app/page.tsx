import ExploreButton from "@/components/ExploreButton";
import {EventCard} from "@/components/EventCard";
import {events} from '@/lib/constants';

const Home = () => {
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
                {events.map(({title, date,location, description,imageUrl,slug,time}) => (
                    <EventCard
                        key={slug}
                        title={title}
                        date={date}
                        time = {time}
                        location={location}
                        description={description}
                        ImageURL={imageUrl}
                        slug={slug}
                    />
                    ))
                }
            </section>
        </>


    )
}
export default Home