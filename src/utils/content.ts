import { getCollection, type CollectionEntry, type InferEntrySchema } from "astro:content";
import { Temporal } from "temporal-polyfill";

export type EventType = keyof InferEntrySchema<"calendar">["type"];

interface EventFilter {
    types?: EventType[];
    since?: Temporal.ZonedDateTime;
}

export async function getCalendarEntries({ types, since }: EventFilter) {
    const filter: ((entry: CollectionEntry<"calendar" | "events">) => unknown) = ({ collection, data: { type, date, dates, endDate } }) => {
        return (
            (
                (types === undefined) ||
                (types.some((t) => !!(type as any)[t]))
            )
            && (
                (collection === "calendar") ||
                (since === undefined) ||
                (endDate && Temporal.ZonedDateTime.compare(endDate, since) >= 0) ||
                (dates?.some((d) => Temporal.ZonedDateTime.compare(d, since) >= 0)) ||
                (date && Temporal.ZonedDateTime.compare(date, since) >= 0)
            )
        );
    };

    const calendarEntries = await getCollection("calendar", filter);
    const eventEntries = (await getCollection("events", filter)).map(e => {
        console.log(e);
        return {
            ...e,
            data: {
                ...e.data,
                url: e.data.url ?? `/events/${e.id}/`,
            }
        };
    });

    return [...calendarEntries, ...eventEntries].filter((entry) => {
        return entry.data.hide !== true;
    });
};
