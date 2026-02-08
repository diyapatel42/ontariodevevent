import Image from 'next/image'
import Link from 'next/link';
import Location from './icons/Location';
import Calendar from './icons/Calendar';
import Time from './icons/Time';

interface EventCardProps {
    title: string;
    date: string;
    location: string;
    description: string;
    image: string;
    slug: string;
    time: string;
    eventurl?: string;
}

export function EventCard({ title, date, location, description, image, slug, time, eventurl }: EventCardProps) {
    return (
        <Link
            href={`/events/${slug}`}
            className="group block bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-zinc-900/60 hover:border-white/20 transition-all duration-500 ease-out"
        >
            <div className="relative w-full h-56 overflow-hidden">
                <Image
                    src={image || '/events/tech-conference-2024.png'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    alt={slug}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
            </div>

            <div className="p-8">
                <h2 className="font-semibold text-white text-2xl mb-6 tracking-tight leading-tight">{title}</h2>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-zinc-400 text-sm">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400 text-sm">
                        <Location className="w-4 h-4 text-zinc-500" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400 text-sm">
                        <Time className="w-4 h-4 text-zinc-500" />
                        <span>{time}</span>
                    </div>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2 mb-4">{description}</p>
                {eventurl && (
                    <p className="text-blue-400 text-xs font-medium truncate">
                        {eventurl.replace('https://', '').replace('http://', '')}
                    </p>
                )}
            </div>
        </Link>
    )
}