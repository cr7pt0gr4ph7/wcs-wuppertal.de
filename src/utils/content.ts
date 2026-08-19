import { getCollection, type CollectionEntry, type InferEntrySchema } from "astro:content";
import { Temporal } from "temporal-polyfill";

export type EventType = keyof InferEntrySchema<"calendar">["type"];

interface EventFilter {
    types?: EventType[];
    tags?: string[][];
    since?: Temporal.ZonedDateTime;
}

export async function getCalendarEntries({ types: typesToFilter, tags: tagsToFilter, since }: EventFilter) {
    const filter: (<C extends "calendar" | "events">(entry: CollectionEntry<C>) => unknown) = ({ collection, data: { type, tags, date, dates, endDate } }) => {
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
    const eventEntries = (await getCollection("events", filter)).flatMap(e => {
        const entries = [{
            ...e,
            data: {
                ...e.data,
                url: e.data.url ?? `/events/${e.id}/`,
            }
        }];
        if (e.data.additional_events) {
            entries.push(...e.data.additional_events.map(e2 => {
                return {
                    ...e,
                    data: {
                        ...e2,
                        url: e2.url ??  e.data.url ?? `/events/${e.id}/`,
                    }
                };
            }));
        }
        return entries;
    });

    return [...calendarEntries, ...eventEntries].filter((entry) => {
        return entry.data.hide !== true;
    });
};
