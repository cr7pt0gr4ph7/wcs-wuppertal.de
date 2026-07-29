import { getCollection, type CollectionEntry, type InferEntrySchema } from "astro:content";
import { Temporal } from "temporal-polyfill";

export type EventType = keyof InferEntrySchema<"calendar">["type"];

interface EventFilter {
    types?: EventType[];
    tags?: string[][];
    since?: Temporal.ZonedDateTime;
}

export async function getCalendarEntries({ types: typesToFilter, tags: tagsToFilter, since }: EventFilter) {
    const filter: ((entry: CollectionEntry<"calendar" | "events">) => unknown) = ({ collection, data: { type, tags, date, dates, endDate } }) => {
        return (
            (
                (typesToFilter === undefined) ||
                (typesToFilter.some((t) => !!(type as any)[t]))
            )
            && (
                (tagsToFilter === undefined) ||
                (tagsToFilter.some((g) => g.every((t) => tags !== undefined && tags.indexOf(t) != -1)))
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
