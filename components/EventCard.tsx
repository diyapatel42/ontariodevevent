import Image from 'next/image'
import Link from 'next/link';
import Location from './icons/Location';
import Calendar from './icons/Calendar';
import Time from './icons/Time';

interface Props {
    title: string
    date: string
    location: string
    description: string
    ImageURL: string
    time :string
    slug:string
}
export function EventCard({ title, date, location, description,ImageURL,slug,time }: Props) {
    return (
        <Link href = {'/events/${slug}'} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 max-w-md mx-auto my-4 hover:scale-[1.02] transition-transform duration-200">
            <Image
                src={ImageURL}
                width={500}
                height={500}
                alt={slug}
            />
            <h2 className=" font-semibold mb-2 text-white">{title}</h2>

                <ul className=" text-xls text-gray-300 mb-1 flex flex-col gap-2">
                    <li className="flex flex-row items-center gap-2">
                        <Calendar className="text-white w-3 h-3" />
                        <span>{date}</span>
                    </li>
                    <li className="flex flex-row items-center gap-2">
                        <Location className="text-white w-3 h-3" />
                        <span>{location}</span>
                    </li>
                    <li className="flex flex-row items-center gap-2">
                        <Time className="text-white w-3 h-3" />
                        <span>{time}</span>
                    </li>
                </ul>

            <p className="text-gray-200">{description}</p>

        </Link>
    )
}