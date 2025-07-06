import { file, glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { Temporal } from "temporal-polyfill";

const eventTypes = [
    "festival",
    "party",
    "regular_course",
    "workshop",
] as const;

const eventTypeInfoSchema = z.union([
    z.boolean(),
    z.object({ requires_registration: z.boolean() })
]).optional();

type EventTypes = {
    [EventType in typeof eventTypes[number]]: typeof eventTypeInfoSchema
};

let eventTypeSchemaStructure: EventTypes = {} as EventTypes

eventTypes.forEach((eventType) => {
    eventTypeSchemaStructure[eventType] = eventTypeInfoSchema;
})

const eventTypeSchema = z.object({
    ...eventTypeSchemaStructure,
    additional_text: z.string().optional(),
    more_infos: z.boolean().optional(),
    requires_registration: z.boolean().optional(),
}).transform((arg) => {
    let result: { [EventType in typeof eventTypes[number]]?: { more_infos: boolean, requires_registration: boolean, additional_text: string | undefined } } = {};
    eventTypes.forEach((eventType) => {
        if (arg[eventType]) {
            result[eventType] = {
                requires_registration: (typeof arg[eventType] === 'object'
                    ? arg[eventType].requires_registration
                    : arg.requires_registration) ?? false,
                additional_text: arg.additional_text ?? undefined,
                more_infos: arg.more_infos ?? false,
            };
        }
    });
    return result;
});

const eventBaseSchemaStructure = {
    title: z.string().transform((str) => str?.replace(/&shy;/g, "\u00AD")?.replace(/&zwsp;/g, "\u200B")),
    subtitle: z.string().optional().transform((str) => str?.replace(/&shy;/g, "\u00AD")?.replace(/&zwsp;/g, "\u200B")),
    // Astro's YAML parser automatically turns things that look like dates into Date instances
    // date: z.string().datetime().transform((str) => Temporal.PlainDateTime.from(str).toZonedDateTime("Europe/Berlin")),
    // endDate: z.string().datetime().transform((str) => Temporal.PlainDateTime.from(str).toZonedDateTime("Europe/Berlin")).optional(),
    date: z.date().transform((date) => Temporal.Instant.from(date.toISOString()).toZonedDateTimeISO("UTC").toPlainDateTime().toZonedDateTime("Europe/Berlin")),
    dates: z.array(z.date().transform((date) => Temporal.Instant.from(date.toISOString()).toZonedDateTimeISO("UTC").toPlainDateTime().toZonedDateTime("Europe/Berlin"))).optional(),
    endDate: z.date().transform((date) => Temporal.Instant.from(date.toISOString()).toZonedDateTimeISO("UTC").toPlainDateTime().toZonedDateTime("Europe/Berlin")).optional(),
    duration: z.string().time().transform((str) => Temporal.PlainTime.from(str).since(new (Temporal.PlainTime)())),
    location: z.string(),
    address: z.object({
        name: z.string().optional(),
        street: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        countryCode: z.string().optional(),
        url: z.string().optional()
    }).optional(),
    links: z.object({
        homepage: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        community: z.string().optional(),
        maps: z.string().optional(),
    }).optional(),
    url: z.string().optional(),
    image: z.union([z.string(), z.object({
        src: z.string(),
        alt: z.string().optional(),
    })]).optional(),
    description: z.string().optional(),
    type: eventTypeSchema,
};

const eventBaseSchema = z.object({
    ...eventBaseSchemaStructure,
});

const transformEndDate = <T extends { date?: Temporal.ZonedDateTime, duration?: Temporal.Duration }>(arg: T) => {
    return {
        endDate: (arg.date && arg.duration ? arg.date.add(arg.duration) : undefined) as T["date"],
        ...arg,
    };
};

const eventFileSchema = z.object({
    ...eventBaseSchemaStructure,
    date: eventBaseSchemaStructure.date.optional(),
    duration: eventBaseSchemaStructure.duration.optional(),
}).transform(transformEndDate);

const withEndDate = <T extends typeof eventBaseSchema>(schema: T) => schema.transform(transformEndDate);

const eventSchema = eventBaseSchema.extend({
    groups: z.array(z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        children: z.array(withEndDate(eventBaseSchema)).optional()
    })).optional(),
    children: z.array(withEndDate(eventBaseSchema)).optional(),
    single_date: z.boolean().optional(),
}).transform(transformEndDate);

// Internal and external events
const calendar = defineCollection({
    loader: file("src/data/calendar.yaml"),
    schema: eventSchema,
});

// Internal events
const events = defineCollection({
    loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/data/events" }),
    schema: eventFileSchema,
});

export const collections = { calendar, events };
