// app/events/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon, ExternalLinkIcon } from "lucide-react";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { EventCard } from "@/components/EventCard";
import { IEvent } from "@/database/event.model";


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    await connectDB();
    const event = await Event.findOne({ slug }).lean();

    if (!event) notFound();

    // Fetch similar events
    const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Minimalist Hero */}
            <div className="relative h-[85vh] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={event.image || "/events/tech-conference-2024.png"}
                        alt={event.title}
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
                </div>

                <div className="relative z-10 flex h-full max-w-6xl mx-auto flex-col justify-end px-8 pb-24 lg:px-12">
                    {/* Subtle badge */}
                    <div className="mb-8 flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2 text-xs font-medium tracking-wide text-zinc-400">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {event.mode}
                        </span>
                        {event.tags?.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-xs font-medium tracking-wide text-zinc-500">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Hero title */}
                    <h1 className="text-6xl font-semibold tracking-tight leading-[1.1] lg:text-8xl max-w-5xl mb-8">
                        {event.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-zinc-400 max-w-3xl leading-relaxed font-light">
                        {event.overview}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className="mx-auto max-w-6xl px-8 py-20 lg:px-12">
                <div className="grid gap-20 lg:grid-cols-[1fr_400px]">
                    {/* Main Content Column */}
                    <div className="space-y-16 order-2 lg:order-1">
                        {/* Description */}
                        <section>
                            <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-500 mb-8">
                                Overview
                            </h2>
                            <div className="text-lg leading-relaxed text-zinc-300 space-y-6 font-light">
                                {event.description.split('\n\n').map((paragraph: string, i: number) => (
                                    <p key={i}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Agenda */}
                        {event.agenda && event.agenda.length > 0 && (
                            <section>
                                <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-500 mb-8">
                                    What to Expect
                                </h2>
                                <div className="space-y-1">
                                    {event.agenda.map((item: string, i: number) => (
                                        <div
                                            key={i}
                                            className="group flex items-start gap-6 py-6 border-b border-white/5 last:border-0 transition-colors hover:border-white/10"
                                        >
                                            <span className="flex-shrink-0 text-sm font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors w-8">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span className="text-lg text-zinc-300 font-light leading-relaxed">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Organizer */}
                        <section className="pt-8 border-t border-white/5">
                            <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-500 mb-4">
                                Organized By
                            </h2>
                            <p className="text-2xl font-light text-white">
                                {event.organizer}
                            </p>
                        </section>
                    </div>

                    {/* Sidebar Info Card (Sticky) */}
                    <div className="order-1 lg:order-2">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            {/* Glass card */}
                            <div className="rounded-3xl bg-zinc-900/50 backdrop-blur-2xl border border-white/10 p-10 space-y-8">
                                {/* Event Details */}
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            <CalendarIcon className="h-5 w-5 text-zinc-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium tracking-wider uppercase text-zinc-500 mb-1">
                                                Date
                                            </p>
                                            <p className="text-sm text-white font-light">
                                                {formattedDate}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            <ClockIcon className="h-5 w-5 text-zinc-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium tracking-wider uppercase text-zinc-500 mb-1">
                                                Time
                                            </p>
                                            <p className="text-sm text-white font-light">
                                                {event.time}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            <MapPinIcon className="h-5 w-5 text-zinc-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium tracking-wider uppercase text-zinc-500 mb-1">
                                                Location
                                            </p>
                                            <p className="text-sm text-white font-light">
                                                {event.venue}
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            <UsersIcon className="h-5 w-5 text-zinc-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium tracking-wider uppercase text-zinc-500 mb-1">
                                                Audience
                                            </p>
                                            <p className="text-sm text-white font-light">
                                                {event.audience}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                {/* CTA Button */}
                                <button className="group w-full relative overflow-hidden rounded-2xl bg-white py-4 text-base font-medium text-black transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 active:scale-[0.98]">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Register Now
                                        <ExternalLinkIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>

                                {/* Event URL */}
                                {event.eventurl && ( <a

                                    href={event.eventurl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center text-sm text-zinc-400 hover:text-white transition-colors"
                                    >
                                    Learn more →
                                    </a>
                                    )}
                            </div>

                            {/* Back link */}
                            <Link
                                href="/"
                                className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors py-4"
                            >
                                ← Back to all events
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Similar Events Section */}
            {similarEvents.length > 0 && (
            <section className="border-t border-white/5 bg-zinc-950/50">
                <div className="mx-auto max-w-6xl px-8 py-24 lg:px-12">
                    <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-500 mb-12">
                        Similar Events
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {similarEvents.map((similarEvent: IEvent) => (
                            <EventCard
                                key={similarEvent.title}
                                {...similarEvent}
                            />
                        ))}
                    </div>
                </div>
            </section>
            )}

            {/* Bottom spacing */}
            <div className="h-32" />

        </div>
    );
}