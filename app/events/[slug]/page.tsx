// app/events/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    UsersIcon,
    ExternalLinkIcon,
} from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { getEventPageData } from "@/lib/events.cached";
import { IEvent } from "@/database/event.model";

export default async function Page({
                                       params,
                                   }: {
    params: { slug: string };
}) {
    const { slug } = params;

    const data = await getEventPageData(slug);
    if (!data) notFound();

    const { event, similarEvents } = data;

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

                    <h1 className="text-6xl font-semibold tracking-tight leading-[1.1] lg:text-8xl max-w-5xl mb-8">
                        {event.title}
                    </h1>

                    <p className="text-xl text-zinc-400 max-w-3xl leading-relaxed font-light">
                        {event.overview}
                    </p>
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-8 py-20 lg:px-12">
                <div className="grid gap-20 lg:grid-cols-[1fr_400px]">
                    <div className="space-y-16 order-2 lg:order-1">
                        <section>
                            <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-500 mb-8">
                                Overview
                            </h2>
                            <div className="text-lg leading-relaxed text-zinc-300 space-y-6 font-light">
                                {event.description
                                    .split("\n\n")
                                    .map((paragraph: string, i: number) => (
                                        <p key={i}>{paragraph}</p>
                                    ))}
                            </div>
                        </section>

                        {event.agenda?.length > 0 && (
                            <section>
                                <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-500 mb-8">
                                    What to Expect
                                </h2>
                                <div className="space-y-1">
                                    {event.agenda.map((item: string, i: number) => (
                                        <div
                                            key={i}
                                            className="group flex items-start gap-6 py-6 border-b border-white/5 last:border-0 hover:border-white/10"
                                        >
                      <span className="w-8 text-sm text-zinc-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                                            <span className="text-lg text-zinc-300 font-light">
                        {item}
                      </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="pt-8 border-t border-white/5">
                            <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-500 mb-4">
                                Organized By
                            </h2>
                            <p className="text-2xl font-light text-white">
                                {event.organizer}
                            </p>
                        </section>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="rounded-3xl bg-zinc-900/50 backdrop-blur-2xl border border-white/10 p-10 space-y-8">
                                <div className="space-y-6">
                                    <Info icon={<CalendarIcon />} label="Date" value={formattedDate} />
                                    <Info icon={<ClockIcon />} label="Time" value={event.time} />
                                    <Info
                                        icon={<MapPinIcon />}
                                        label="Location"
                                        value={event.venue}
                                        sub={event.location}
                                    />
                                    <Info icon={<UsersIcon />} label="Audience" value={event.audience} />
                                </div>

                                <button className="w-full rounded-2xl bg-white py-4 text-black">
                                    Register Now
                                </button>

                                {event.eventurl && (
                                    <a
                                        href={event.eventurl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-center text-sm text-zinc-400 hover:text-white"
                                    >
                                        Learn more →
                                    </a>
                                )}
                            </div>

                            <Link
                                href="/"
                                className="block text-center text-sm text-zinc-500 hover:text-white py-4"
                            >
                                ← Back to all events
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {similarEvents.length > 0 && (
                <section className="border-t border-white/5 bg-zinc-950/50">
                    <div className="mx-auto max-w-6xl px-8 py-24 lg:px-12">
                        <h2 className="text-sm font-semibold tracking-widest uppercase text-zinc-500 mb-12">
                            Similar Events
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {similarEvents.map((e: IEvent) => (
                                <EventCard key={e.slug} {...e} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

function Info({
                  icon,
                  label,
                  value,
                  sub,
              }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub?: string;
}) {
    return (
        <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                {icon}
            </div>
            <div>
                <p className="text-xs uppercase text-zinc-500">{label}</p>
                <p className="text-sm text-white">{value}</p>
                {sub && <p className="text-xs text-zinc-500">{sub}</p>}
            </div>
        </div>
    );
}
