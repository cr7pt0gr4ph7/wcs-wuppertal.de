import { file, glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

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
    requires_registration: z.boolean().optional(),
}).transform((arg) => {
    let result: { [EventType in typeof eventTypes[number]]?: { requires_registration: boolean } } = {};
    eventTypes.forEach((eventType) => {
        if (arg[eventType]) {
            result[eventType] = {
                requires_registration: (typeof arg[eventType] === 'object'
                    ? arg[eventType].requires_registration
                    : arg.requires_registration) ?? false
            };
        }
    });
    return result;
});

const eventBaseSchema = z.object({
    title: z.string().transform((str) => str?.replace(/&shy;/g, "\u00AD")?.replace(/&zwsp;/g, "\u200B")),
    subtitle: z.string().optional().transform((str) => str?.replace(/&shy;/g, "\u00AD")?.replace(/&zwsp;/g, "\u200B")),
    date: z.date(),
    time: z.string().time().optional(),
    duration: z.string().time(),
    location: z.string(),
    links: z.object({
        homepage: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        community: z.string().optional(),
        maps: z.string().optional(),
    }).optional(),
    url: z.string().optional(),
    type: eventTypeSchema,
});

const eventSchema = eventBaseSchema.extend({
    groups: z.array(z.object({
        title: z.string(),
        children: z.array(eventBaseSchema).optional()
    })).optional(),
    children: z.array(eventBaseSchema).optional()
});

// Internal and external events
const calendar = defineCollection({
    loader: file("src/data/calendar.yaml"),
    schema: eventSchema
});

// Internal events
const events = defineCollection({
    loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/data/events" }),
    schema: eventSchema
});

export const collections = { calendar, events };
