import { file } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const calendar = defineCollection({
    loader: file("src/data/calendar.yaml"),
    schema: z.object({
        name: z.string(),
        date: z.date(),
        time: z.string().time(),
        duration: z.string().time(),
        location: z.string(),
        url: z.string(),
        type: z.object({
            regular_course: z.boolean().optional()
        })
    })
});

export const collections = { calendar }