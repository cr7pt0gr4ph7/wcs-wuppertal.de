import { file } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const eventTypeSchema = z.object({
    festival: z.boolean().optional(),
    party: z.boolean().optional(),
    regular_course: z.boolean().optional(),
    workshop: z.boolean().optional(),
    requires_registration: z.boolean().optional(),
});

const eventBaseSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.date(),
    time: z.string().time().optional(),
    duration: z.string().time(),
    location: z.string(),
    url: z.string().optional(),
    type: eventTypeSchema,
});

const calendar = defineCollection({
    loader: file("src/data/calendar.yaml"),
    schema: eventBaseSchema.extend({
        groups: z.array(z.object({
            title: z.string(),
            children: z.array(eventBaseSchema).optional()
        })).optional(),
        children: z.array(eventBaseSchema).optional()
    })
});

export const collections = { calendar }
